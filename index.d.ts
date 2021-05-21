import { Client } from "discord.js"

type User = {
    userID: string
    guildID: string
    xp: number
    level: number
    lastUpdated: Date
    cleanXp: number
    cleanNextLevelXp: number
}

type LeaderboardUser = {
    serID: string
    guildID: string
    xp: number
    level: number
    position: number
    username: String | null
    discriminator: String | null
}

declare module "bacc-lib" {
    export default class BaccLib {
        static async setURL(dbUrl: String) : Promise<typeof import("mongoose")>
        static async addXp(userID: string, guildID: string, xp: number) : Promise<User>
        static async addLevel(userID: string, guildID: string, levels: number) : Promise<User>
        static async setXp(userID: string, guildID: string, xp: number) : Promise<User>
        static async setLevel(userID: string, guildID: string, levels: number) : Promise<User>
        static async subtractXp(userID: string, guildID: string, xp: number) : Promise<User>
        static async subtractLevel(userID: string, guildID: string, levels: number) : Promise<User>
        static async fetch(userID: string, guildID: string, fetchPosition = false) : Promise<User>
        static async fetchLeaderboard(guildID: string, limit: number) : Promise<User[] | []>
        static async computeLeaderboard(client: Client, leaderboard: User[], fetchUsers = false) : Promise<LeaderboardUser[] | []>
        static xpFor(targetLevel: number) : number
    }
}