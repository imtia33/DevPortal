import {Client, Databases, Query,Account,Storage,Functions,ID,OAuthProvider} from 'react-native-appwrite';
import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser';
// Fix: Use correct import for Linking
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('684ac8600032f6eccf56')

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);
const functions = new Functions(client);

export async function getAccount() {
  try {
    const acc = await account.get();
    console.log(acc)
    return acc;
  } catch (error) {
    return null;
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) return null;

    return currentAccount;
  } catch (error) {
    console.log(error);
    return null;
  }
}



export const login = async () => {
  try {
    
    const deepLink = new URL(makeRedirectUri());
    const scheme = `${deepLink.protocol}//`; // e.g. 'exp://' or 'playground://'

    // Start OAuth flow
    const loginUrl = await account.createOAuth2Token(
      OAuthProvider.Github,
      Platform.OS==='web'?`${deepLink}/oauth-redirect`:`${deepLink}`,
      Platform.OS==='web'?`${deepLink}/oauth-redirect`:`${deepLink}`,
     
     
    );

    if (Platform.OS === 'web') {
     
      window.location.href = loginUrl;
      if (result.type === 'success' && result.url) {
        // Extract credentials from OAuth redirect URL
        const url = new URL(result.url);
        const secret = url.searchParams.get('secret');
        const userId = url.searchParams.get('userId');

        if (secret && userId) {
          // Create session with OAuth credentials
          const res=await account.createSession(userId, secret);
          if(res){
            console.log(res);
          return await getAccount(); // get user, set state, and redirect as needed
        }
        }
      }
      return;
    } else {
     
      const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

      if (result.type === 'success' && result.url) {
        // Extract credentials from OAuth redirect URL
        const url = new URL(result.url);
        const secret = url.searchParams.get('secret');
        const userId = url.searchParams.get('userId');

        if (secret && userId) {
         
          await account.createSession(userId, secret);
          return await getAccount(); 
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export async function handleOAuthRedirect() {
  if (Platform.OS === 'web') {
    // Web: get params from window.location
    const params = new URLSearchParams(window.location.search);
    const secret = params.get('secret');
    const userId = params.get('userId');

    if (secret && userId) {
      try {
        await account.createSession(userId, secret);
        
        window.history.replaceState({}, document.title, window.location.pathname);
        
        return await getAccount();
      } catch (e) {
        console.error('Failed to create session:', e);
        return null;
      }
    }
    return null;
  } else {
    const url = await Linking.getInitialURL();
    if (url) {
      const parsed = Linking.parse(url);
      
      const secret = parsed.queryParams?.secret;
      const userId = parsed.queryParams?.userId;

      if (secret && userId) {
        try {
          await account.createSession(userId, secret);
          return await getAccount();
        } catch (e) {
          console.error('Failed to create session:', e);
          return null;
        }
      }
    }
    return null;
  }
}
export const logout=async()=>{
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}



export async function createShowoff(showoff) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Login required');
  return functions.createExecution('68712984002d57a98856', showoff);
}
export const create=async(payload)=>{
  try{
  const res = await databases.createDocument(
    '6853a0910036fa92b87b', // databaseId
    '686e24d4000a49ad0954', // collectionId
    ID.unique(), // documentId
    {
      title: payload.title,
      tagline: payload.tagline || '',
      Description: payload.description, // fixed key name
      tags: JSON.stringify(payload.tags), // only if required
      coverImageUrl: payload.coverImageUrl,
      gitRepo: payload.gitRepo || '',
      demo: JSON.stringify(payload.demo), // only if required
      userId: "actualUserId", // replace with real userId
      avatarUrl: payload.userAvatar || '',
      stars: 0,
      username: payload.userName || '',
    }
  );
} catch (error) {
  console.log('Error creating document:', error);
  throw new Error(`Failed to create document: ${error.message}`);
}
}
