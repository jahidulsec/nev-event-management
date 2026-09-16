import "dotenv/config";
import { db } from "@/config/db";

async function main() {
  const oldUser = await db.ao.findMany();

  // create admin user
  await db.users.createMany({
    data: oldUser.map((i) => ({
      full_name: i.full_name,
      designation: i.designation,
      email: i.email,
      employee_id: i.employee_id ?? "",
      password:
        "qqPbIJUz8Sr/2ZiP9pEpiIAzcjr+ICTY/BOCEEzDlxtzQAxc3vH869PxqiWE6Wfdl9eYwvhjxMJpnRIuLirYWA==",
      group: i.group_name,
      status: "active",
    })),
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
