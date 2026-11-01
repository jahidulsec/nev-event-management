import "dotenv/config";
import { db } from "@/config/db";

async function main() {
  // const oldUser = await db.ao.findMany();

  // for (const i of oldUser) {
  //   await db.users.create({
  //     data: {
  //       full_name: i.full_name,
  //       designation: i.designation,
  //       email: i.email,
  //       employee_id: i.employee_id ?? "",
  //       password:
  //         "qqPbIJUz8Sr/2ZiP9pEpiIAzcjr+ICTY/BOCEEzDlxtzQAxc3vH869PxqiWE6Wfdl9eYwvhjxMJpnRIuLirYWA==",
  //       group: i.group_name,
  //       status: "active",
  //       users_role: {
  //         create: {
  //           role: "ao",
  //         },
  //       },
  //     },
  //   });
  // }

  await db.user_role.create({
    data: {
      work_area_code: "20075",
      role: "ao",
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
