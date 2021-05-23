import { Client } from "discord.js"

type XpUser = {
    userID: string
    guildID: string
    xp: number
    level: number
    lastUpdated: Date
    cleanXp: number
    cleanNextLevelXp: number
}

type XpLeaderboardUser = {
    userID: string
    guildID: string
    xp: number
    level: number
    position: number
    username: String | null
    discriminator: String | null
}

type CoinsUser = {
    userID: string
    guildID: string
    coins: number
}

type CoinsLeaderboardUser = {
    userID: string
    guildID: string
    coins: number
    position: number
    username: String | null
    discriminator: String | null
}

declare module "bacclib" {
    export default class BaccLib {
        static async setURL(dbUrl: String) : Promise<typeof import("mongoose")>
        static async addXp(userID: string, guildID: string, xp: number) : Promise<XpUser>
        static async addLevel(userID: string, guildID: string, levels: number) : Promise<XpUser>
        static async setXp(userID: string, guildID: string, xp: number) : Promise<XpUser>
        static async setLevel(userID: string, guildID: string, levels: number) : Promise<XpUser>
        static async subtractXp(userID: string, guildID: string, xp: number) : Promise<XpUser>
        static async subtractLevel(userID: string, guildID: string, levels: number) : Promise<XpUser>
        static async fetchXp(userID: string, guildID: string, fetchPosition = false) : Promise<XpUser>
        static async fetchXpLeaderboard(guildID: string, limit: number) : Promise<XpUser[] | []>
        static async computeXpLeaderboard(client: Client, leaderboard: XpUser[], fetchUsers = false) : Promise<XpLeaderboardUser[] | []>
        static xpFor(targetLevel: number) : number
        static async addCoins(userID: string, guildID: string, coins: number) : Promise<CoinsUser>
        static async setCoins(userID: string, guildID: string, coins: number) : Promise<CoinsUser>
        static async subtractCoins(userID: string, guildID: string, coins: number) : Promise<CoinsUser>
        static async fetchCoins(userID: string, guildID: string, fetchPosition = false) : Promise<CoinsUser>
        static async fetchCoinsLeaderboard(guildID: string, limit: number) : Promise<CoinsUser[] | []>
        static async computeCoinsLeaderboard(client: Client, leaderboard: CoinsUser[], fetchUsers = false) : Promise<CoinsLeaderboardUser[] | []>
    }
}