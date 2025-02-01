import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { createInterface } from "readline";

const prisma = new PrismaClient();
const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const services = {
    mysql: { name: "ucollab-mysql" },
    minio: { name: "ucollab-minio" },
    redis: { name: "ucollab-redis" },
    redisCommander: {
        name: "ucollab-redis-commander",
    },
};

async function main() {
    console.log("🔍 Checking dev setup...");

    try {
        execSync("npm list", { stdio: "ignore" });

        const dockerPs = execSync("docker ps").toString();
        let allRunning = true;

        for (const [service, config] of Object.entries(services)) {
            if (!dockerPs.includes(config.name)) {
                console.log(`starting ${service}...`);
                allRunning = false;
            }
        }

        if (!allRunning) {
            execSync("npm run services:up", { stdio: "inherit" });
            console.log("⏳ Waiting for services to be ready...\n");
            await new Promise((resolve) => setTimeout(resolve, 10000));
        }

        execSync("npm run db:push", { stdio: "inherit" });
        console.log("✓ setup complete");
    } catch (error) {
        console.error("✗ setup check failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }

    readline.close();
}

main().catch(async (error) => {
    console.error("✗ setup check failed:", error);
    await prisma.$disconnect();
    process.exit(1);
});
