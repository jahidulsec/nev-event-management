"use server";

import { db } from "@/config/db";
import { Prisma } from "./generated/prisma";

export const getApproverWorkArea = async (
  event: Prisma.eventGetPayload<{
    include: {
      event_type: {
        select: {
          approver: {
            orderBy: {
              created_at: "asc";
            };
          };
        };
      };
      user: {
        select: {
          ao: true;
        };
      };
      product: {
        select: {
          product_user: {
            include: {
              user: {
                select: {
                  user_role: true;
                };
              };
            };
          };
        };
      };
    };
  }>,
  index: number = 0,
) => {
  const firstApproverRole = event.event_type?.approver?.[index].user_type;
  const productUser = event.product.product_user.find((i) =>
    i.user.user_role.some((r) => r.role === firstApproverRole),
  );
  const ao = event.user.ao;
  let firstApproverWorkArea = "";

  switch (firstApproverRole) {
    case "flm":
      firstApproverWorkArea = ao?.rm_code ?? "";
      break;
    case "slm":
      firstApproverWorkArea = ao?.zm_code ?? "";
      break;
    case "franchise_head":
      firstApproverWorkArea = productUser?.work_area_code ?? ""; //ao?.wing_code ?? ""
      break;
    case "marketing":
      firstApproverWorkArea = productUser?.work_area_code ?? "";
      break;
    case "ec":
      firstApproverWorkArea = productUser?.work_area_code ?? "";
      break;
  }

  if (firstApproverRole === "director_sales") {
    const director = await db.user.findFirst({
      where: {
        user_role: {
          some: {
            role: "director_sales",
          },
        },
      },
    });

    firstApproverWorkArea = director?.work_area_code ?? "";
  }

  return firstApproverWorkArea;
};

export const getApproverDetails = async (
  event: Prisma.eventGetPayload<{
    include: {
      event_type: {
        select: {
          approver: {
            orderBy: {
              created_at: "asc";
            };
          };
        };
      };
      user: {
        select: {
          ao: true;
        };
      };
      product: {
        select: {
          product_user: {
            include: {
              user: {
                select: {
                  user_role: true;
                };
              };
            };
          };
        };
      };
    };
  }>,
  index: number = 0,
) => {
  const firstApproverRole = event.event_type?.approver?.[index]?.user_type;
  const productUser = event.product.product_user.find((i) =>
    i.user.user_role.some((r) => r.role === firstApproverRole),
  );
  const ao = event.user.ao;
  let firstApproverWorkArea = "";

  switch (firstApproverRole) {
    case "flm":
      firstApproverWorkArea = ao?.rm_code ?? "";
      break;
    case "slm":
      firstApproverWorkArea = ao?.zm_code ?? "";
      break;
    case "franchise_head":
      firstApproverWorkArea = productUser?.work_area_code ?? "";  //ao?.wing_code ?? ""
      break;
    case "marketing":
      firstApproverWorkArea = productUser?.work_area_code ?? "";
      break;
    case "ec":
      firstApproverWorkArea = productUser?.work_area_code ?? "";
      break;
  }

  if (firstApproverRole === "director_sales") {
    const director = await db.user.findFirst({
      where: {
        user_role: {
          some: {
            role: "director_sales",
          },
        },
      },
    });

    firstApproverWorkArea = director?.work_area_code ?? "";
  }

  const selectedField = {
    select: {
      full_name: true,
      email: true,
    },
  };

  const userDetails = await db.user.findUnique({
    where: {
      work_area_code: firstApproverWorkArea,
    },
    include: {
      ao: {
        ...selectedField,
      },
      flm: {
        ...selectedField,
      },
      slm: {
        ...selectedField,
      },
      ec: {
        ...selectedField,
      },
      marketing: {
        ...selectedField,
      },
      franchise_head: {
        ...selectedField,
      },
    },
  });

  return {
    work_area_code: userDetails?.work_area_code,
    ...userDetails?.[firstApproverRole === 'director_sales' ? "franchise_head" as 'ao' : firstApproverRole as "ao"],
  };
};


