/**
 * Delay code execution for the specified number of milliseconds
 * @param ms The amount of milliseconds to wait
 */
export async function delay(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}
