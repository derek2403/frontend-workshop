import { PublicKey, clusterApiUrl } from '@solana/web3.js';

// Make sure this matches EXACTLY with your deployed program ID
export const PROGRAM_ID = new PublicKey("4PM6rJQTmGqoDB2kwytZCAGmP69o4f3qWLxn3LF6is3q");
export const GAME_POOL_SEED = "game_pool";
export const NETWORK = clusterApiUrl("devnet"); 