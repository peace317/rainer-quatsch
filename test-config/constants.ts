// This is primarily args for our DB Factories
// storageState is the named path/file where Playwright will save our session
export const ADMIN = {
    id: "6615b968ef9dd602da8cb019",
    email: 'brainiac@lex.com',
    displayName: 'Lex Luther',
    username: 'lexilu',
    password: '1amBrainiac!',
    storageState: './test-results/adminStorageState.json'
};

export const USER = {
    id: "6615b968ef9dd602da8cb01a",
    email: 'clark@thedaily.com',
    displayName: 'Clark Kent',
    username: 'Clark',
    password: 'krypton8!',
    storageState: './test-results/userStorageState.json'
};

export const CONVERSATION = {
    name: 'Test Conversation'
};
