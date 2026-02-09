import "dotenv/config";
import inquirer from "inquirer";
import { hashPassword } from "@/utils/password";
import { db } from "@/config/db";

async function main() {
    const answers = await inquirer.prompt([
        
        {
            type: "input",
            name: "work_area_code",
            message: "Enter your work area code:",
        },
        {
            type: "password",
            name: "password",
            message: "Enter your password:",
            mask: "*",
        },
        {
            type: "list",
            name: "role",
            message: "Select your role:",
            choices: ["superadmin", "ao", "flm", "slm", "marketing", "director", "eo"],
        },
    ]);

    // create admin user
    await db.user.create({
        data: {
            work_area_code: answers.work_area_code,
            password: await hashPassword(answers.password),
            role: answers.role,
        },
    });

    console.log(
        `Welcome, ${answers.work_area_code}! You are signed up as ${answers.role}.`
    );
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
