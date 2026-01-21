import "dotenv/config";
import inquirer from "inquirer";
import { hashPassword } from "@/utils/password";
import { quizdb } from "@/config/db";

async function main() {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter your name:",
        },
        {
            type: "input",
            name: "mobile",
            message: "Enter your mobile:",
        },
        {
            type: "input",
            name: "sap_id",
            message: "Enter your SAP ID:",
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
            choices: ["superadmin", "admin", "mio"],
        },
    ]);

    // create admin user
    await quizdb.user.create({
        data: {
            sap_id: answers.sap_id,
            password: await hashPassword(answers.password),
            role: answers.role,
            user_information: {
                create: {
                    full_name: answers.name, mobile: answers.mobile
                }
            }
        },
    });

    console.log(
        `Welcome, ${answers.name}! You are signed up as ${answers.role}.`
    );
}

main()
    .then(async () => {
        await quizdb.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await quizdb.$disconnect();
        process.exit(1);
    });
