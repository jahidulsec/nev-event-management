import { Prisma } from "./generated/prisma";

export const getFirstApproverWorkArea = (
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
) => {
  const firstApproverRole = event.event_type?.approver?.[0].user_type;
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
      firstApproverWorkArea = ao?.wing_code ?? "";
      break;
    case "marketing":
      firstApproverWorkArea = productUser?.work_area_code ?? "";
      break;
    case "ec":
      firstApproverWorkArea = productUser?.work_area_code ?? "";
      break;
  }

  return firstApproverWorkArea;
};
