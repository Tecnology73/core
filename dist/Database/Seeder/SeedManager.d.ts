import { Seeder } from "./Seeder";
export declare class SeedManager {
    seeders: (new () => Seeder)[];
    /**
     * Allow the user to register a seeder which will be run
     *
     * @param {T} seeder
     */
    registerSeeder<T extends new () => Seeder>(seeder: T): void;
    /**
     * Run through all user defined seeders and run them
     *
     * @returns {Promise<void>}
     */
    runSeeders(): Promise<void>;
}
