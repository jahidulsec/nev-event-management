"use server";

import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";
import { getCleanData } from "@/utils/formatter";
import {
  EventExportQuerySchema,
  EventExportQueryType,
  EventQuerySchema,
  EventQueryType,
} from "../actions/schema";
import { getSerializeData } from "@/utils/helper";
import { endOfDay, startOfDay } from "date-fns";

// export type EventMultiProps = Prisma.eventGetPayload<{
//   include: {
//     event_type: {
//       include: {
//         approver: {
//           orderBy: {
//             created_at: "asc";
//           };
//         };
//       };
//     };
//     // product: true;
//     event_approver: {
//       include: {
//         event_status_history: true;
//       };
//     };
//   };
// }>;

export type EventMultiProps = {
  id: string,
  title: string,
  event_date: Date,
  user_id: string,
  name: string,
  current_status: string,
  created_at: Date,
  total: number,
  last_approver_id: string | null,
  last_approver_role: string | null,
  current_approver_role: string | null,
  type_title: string,
  upper_limit: number,
  lower_limit: number
}

export type EventSingleProps = Prisma.eventGetPayload<{
  include: {
    event_attachment: true;
    event_budget: true;
    event_consultant: {
      include: {
        doctor: true;
        event_consultant_approval: true;
      };
    };
    product: {
      select: {
        name: true;
      };
    };
    event_type: {
      include: {
        approver: true;
      };
    };
    event_approver: {
      include: {
        event_status_history: true;
      };
    };
    user: {
      select: {
        ao: {
          select: {
            full_name: true;
            work_area_code: true;
            employee_id: true;
            designation: true;
            rm_code: true;
          };
        };
      };
    };
  };
}>;

const getMulti = async (query: EventQueryType) => {
  try {
    const cleanData = getCleanData(query);

    // validated searchparams
    const params = EventQuerySchema.parse(cleanData);


    const productUserRoles = ["ec", 'marketing', 'franchise_head'];
    const aoHierarchyRole = ["flm", "slm"]

    let baseQuery = `
      WITH last_approver AS (
        SELECT 
          ea.event_id,
          ea.user_id,
          ea.user_role,
          ea.created_at,
          ROW_NUMBER() OVER (
            PARTITION BY ea.event_id 
            ORDER BY ea.created_at DESC
          ) AS rn
        FROM event_approver ea
      ),

      current_approver AS (
        SELECT 
          e.id AS event_id,
          a.user_type,
          a.type,
          ROW_NUMBER() OVER (
            PARTITION BY e.id 
            ORDER BY a.created_at ASC
          ) AS rn
        FROM event e
        JOIN approver a 
          ON a.event_type_id = e.event_type_id

        LEFT JOIN event_approver ea
          ON ea.event_id = e.id 
          AND ea.user_role = a.user_type   -- match by role

        WHERE ea.user_role IS NULL   -- not yet approved
      )

      SELECT 
        e.id,
        e.title,
        e.event_date,
        e.user_id,
        p.name,
        e.current_status,
        e.created_at,

        et.title type_title,
        et.upper_limit,
        et.lower_limit,

        count(e.id) over() total,

        -- last approver (actual person)
        la.user_id   AS last_approver_id,
        la.user_role AS last_approver_role,

        -- current approver (role)
        ca.user_type AS current_approver_role

      FROM event e

      LEFT JOIN product p on p.id = e.product_id
      LEFT JOIN event_type et on et.id = e.event_type_id

      ${productUserRoles.includes(params.role as string) ?
        ' LEFT JOIN product_user pu on pu.product_slug=p.id '
        :
        ''}
        
      -- 

      ${aoHierarchyRole.includes(params.role as string) ?
        ' LEFT JOIN ao a on a.work_area_code = e.user_id '
        :
        ''}

    

      LEFT JOIN last_approver la 
        ON la.event_id = e.id AND la.rn = 1

      LEFT JOIN current_approver ca 
        ON ca.event_id = e.id AND ca.rn = 1

        WHERE 1=1

        -- this is for ao Hierarchy roles
        ${params.role === 'flm' ?
        ` AND a.rm_code="${params.work_area_code}" `
        : params.role === 'slm' ? ` AND a.zm_code="${params.work_area_code}" `
          : ''
      }
        
        -- this is for product user
        ${productUserRoles.includes(params.role as string) ?
        ` AND pu.work_area_code = "${params.work_area_code}" `
        : ''
      }

        -- current approver filter
        ${params.role !== 'ec' && params.role !== 'superadmin' ?
        ` AND ca.user_type="${params.role}" `
        : ''
      }

      -- search filter
      ${params.search ?
        ` AND e.title LIKE "%${params.search}%" `
        : ''
      }
        

      -- status filter
      ${params.status ?
        ` AND e.current_status="${params.status}" `
        : ''
      }

    `
    baseQuery += ` ORDER BY e.created_at DESC `
    baseQuery += ` LIMIT ${(params.page - 1) * params.size}, ${params.size} `

    console.log(baseQuery)

    const data: any[] = await db.$queryRawUnsafe(
      baseQuery
    );

    return apiResponse.multi<EventMultiProps>({
      message: "Get events successful",
      data: getSerializeData(data) as EventMultiProps[],
      count: Number(data?.[0]?.total || 0),
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

const getSingle = async (id: string) => {
  try {
    const data = await db.event.findUnique({
      where: { id },
      include: {
        event_attachment: true,
        event_budget: true,
        event_consultant: {
          include: {
            doctor: true,
            event_consultant_approval: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            ao: {
              select: {
                full_name: true,
                work_area_code: true,
                employee_id: true,
                designation: true,
                rm_code: true,
              },
            },
          },
        },
        event_type: {
          include: {
            approver: {
              orderBy: {
                created_at: "asc",
              },
            },
          },
        },
        event_approver: {
          include: {
            event_status_history: {
              orderBy: {
                created_at: "desc",
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    // if quiz does not exist, throw error
    if (!data) throw new Error("Data not found");

    return apiResponse.single<EventSingleProps>({
      message: "Get event successful",
      data: getSerializeData(data),
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

const getEventsExportInformation = async (query: EventExportQueryType) => {
  try {
    const cleanData = getCleanData(query);

    // validated searchparams
    const params = EventExportQuerySchema.parse(cleanData);

    const baseQuery = `
    WITH ev AS (
      SELECT 
        e.id,
        e.track_no,
        e.user_id as work_area,
        a.employee_id,
        a.full_name,
        a.group_name,
        et.title,
        p.name as product,
        e.title AS event_title,
        f.full_name AS rm_name,
        a.rm_code AS rm_code,
        e.created_at,
        e.event_date,
        e.venue,
        e.institute,
        e.institute_dept,
        e.food_supplier,
        e.internal_participants,
        e.external_participants,
        e.other_participants,
        (e.internal_participants + e.external_participants + e.other_participants) AS total_participants,
        e.current_status, 
        CASE 
          WHEN e.current_status = 'approved'
            THEN e.updated_at
          ELSE NULL
        END AS approval_date
      FROM event e
      LEFT JOIN ao a ON a.work_area_code = e.user_id
      LEFT JOIN event_type et ON et.id = e.event_type_id
      LEFT JOIN product p ON p.id = e.product_id
      LEFT JOIN flm f ON f.work_area_code = a.rm_code
    ),

    budget AS (
      SELECT 
        event_id,
        
        SUM(CASE WHEN item = 'Venue Charge' THEN unit_cost * unit ELSE 0 END) AS venue_charge,
        SUM(CASE WHEN item = 'Food' THEN unit_cost * unit ELSE 0 END) AS food_cost,
        SUM(CASE WHEN item = 'Food' THEN unit ELSE 0 END) AS food_unit,
        SUM(CASE WHEN item = 'Food' THEN unit_cost ELSE 0 END) AS food_per_cost,
        SUM(CASE WHEN item = 'Transportation' THEN unit_cost * unit ELSE 0 END) AS transportation,
        SUM(CASE WHEN item = 'Projector-Screen' THEN unit_cost * unit ELSE 0 END) AS projector,
        SUM(CASE WHEN item = 'Sound System' THEN unit_cost * unit ELSE 0 END) AS sound_system,
        SUM(CASE WHEN item = 'Logistics/Others' THEN unit_cost * unit ELSE 0 END) AS other_cost,
        SUM(unit_cost * unit) AS total_budget
      FROM event_budget
      GROUP BY event_id
    ),

    h AS (
      SELECT 
        ec1.event_id,
        SUM(ec1.honorarium * ec1.duration_h) AS total_honorarium
      FROM event_consultant ec1
      GROUP BY ec1.event_id
    )

    SELECT 
      ev.*,

      -- Budget
      b.venue_charge,
      b.food_cost,
      b.food_per_cost,
      b.food_unit,
      b.transportation,
      b.projector,
      b.sound_system,
      b.other_cost,
      b.total_budget,

      (b.total_budget + COALESCE(h.total_honorarium, 0)) 
        AS total_eb_h,

      d.dr_child_id,
      d.full_name dr_name,
      (ec.honorarium * ec.duration_h) as honorarium,
      eca.nth_engagement,
      ec.role
    FROM ev
    LEFT JOIN budget b ON b.event_id = ev.id
    LEFT JOIN h ON h.event_id = ev.id      
    LEFT JOIN event_consultant ec ON ec.event_id = ev.id
    LEFT JOIN doctor d on d.id=ec.doctor_id
    LEFT join event_consultant_approval eca on ec.id =eca.consultant_Id
    where 1=1
    ${params.start && params.end ? ` AND ev.created_at >= '${startOfDay(new Date(params.start)).toISOString()}' AND ev.created_at <= '${endOfDay(new Date(params.end)).toISOString()}' ` : ""}
    ${params.status ? ` AND ev.current_status = '${params.status}' ` : ""}
    order by ev.created_at
    `;

    const res = await db.$queryRawUnsafe(baseQuery);

    return apiResponse.multi<any>({
      message: "Get leaderboard successful",
      data: getSerializeData(res as any[]),
      count: 0, // serializedData?.[0]?.total_count,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error });
  }
};

export {
  getMulti as getEvents,
  getSingle as getEvent,
  getEventsExportInformation,
};
