"use server";

import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";
import { getCleanData } from "@/utils/formatter";
import { EventQuerySchema, EventQueryType } from "../actions/schema";
import { getSerializeData } from "@/utils/helper";

export type EventMultiProps = Prisma.eventGetPayload<{
  include: {
    event_type: {
      include: {
        approver: {
          orderBy: {
            created_at: "asc";
          };
        };
      };
    };
    user: {
      include: {
        user_details: true;
      };
    };
    // product: true;
    event_approver: {
      include: {
        event_status_history: true;
      };
    };
    event_consultant: {
      select: {
        event_consultant_approval: true;
      };
    };
  };
}>;

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

    // extract params
    const filter: Prisma.eventWhereInput = {
      ...(params.search && {
        OR: [
          {
            title: {
              contains: params.search,
            },
          },
          {
            id: {
              contains: params.search,
            },
          },
          {
            track_no: {
              startsWith: params.search,
            },
          },
          {
            user_id: {
              startsWith: params.search,
            },
          },
        ],
      }),
      ...(params.work_area_code &&
        params.role === "ao" && {
          user_id: params.work_area_code,
        }),
      ...(params.role === "flm" &&
        params.work_area_code && {
          user: {
            ao: {
              rm_code: params.work_area_code,
            },
          },
          event_type: {
            approver: {
              some: {
                user_type: params.role,
              },
            },
          },
        }),
      ...(params.role === "slm" &&
        params.work_area_code && {
          user: {
            ao: {
              zm_code: params.work_area_code,
            },
          },
          event_type: {
            approver: {
              some: {
                user_type: params.role,
              },
            },
          },
        }),
      ...(params.role === "franchise_head" &&
        params.work_area_code && {
          user: {
            ao: {
              wing_code: params.work_area_code,
            },
          },
          event_type: {
            approver: {
              some: {
                user_type: params.role,
              },
            },
          },
        }),
      ...(params.role === "director_sales" &&
        params.work_area_code && {
          event_type: {
            approver: {
              some: {
                user_type: params.role,
              },
            },
          },
        }),
      ...(params.role?.includes("marketing") &&
        params.work_area_code && {
          product: {
            product_user: {
              some: {
                work_area_code: params.work_area_code,
              },
            },
          },
          event_type: {
            approver: {
              some: {
                user_type: params.role,
              },
            },
          },
        }),
      ...(params.role === "ec" &&
        params.work_area_code && {
          product: {
            product_user: {
              some: {
                work_area_code: params.work_area_code,
              },
            },
          },
          // current_status: "approved",
        }),

      ...(params.status && {
        current_status: params.status,
      }),
    };

    const [data, count] = await Promise.all([
      db.event.findMany({
        include: {
          user: { include: { user_details: true } },
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
          event_consultant: {
            select: {
              event_consultant_approval: true,
            },
          },
        },
        where: filter,
        skip: (params.page - 1) * params.size,
        take: params.size,
        orderBy: {
          created_at: params.sort ?? "desc",
        },
      }),
      db.event.count({
        where: filter,
      }),
    ]);

    return apiResponse.multi<EventMultiProps>({
      message: "Get events successful",
      data: getSerializeData(data) as EventMultiProps[],
      count,
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

const getEventsExportInformation = async () => {
  try {
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
        (e.internal_participants + e.external_participants + e.other_participants) AS total_participants,
        e.current_status
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
      eca.nth_engagement
    FROM ev
    LEFT JOIN budget b ON b.event_id = ev.id
    LEFT JOIN h ON h.event_id = ev.id      
    LEFT JOIN event_consultant ec ON ec.event_id = ev.id
    LEFT JOIN doctor d on d.id=ec.doctor_id
    LEFT join event_consultant_approval eca on ec.id =eca.consultant_Id
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
