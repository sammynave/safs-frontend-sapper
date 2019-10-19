import { writable } from 'svelte/store';

export const users = writable([]);
export const hangTypes = writable([]);
export const myHangs = writable([]);
export const eligibleHangs = writable([]);
export const currentUser = writable();
