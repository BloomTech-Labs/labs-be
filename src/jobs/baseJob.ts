import "./../pre-start"; // Must be the first import
import { intializeDB } from "@shared/Database";

export default function run(): Promise<void> {
  return intializeDB();
}
