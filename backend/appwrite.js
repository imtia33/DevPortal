import {Client, Databases, Query,Account,Storage,Functions,ID,OAuthProvider,Avatars,Permission,Role} from 'react-native-appwrite';
import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';


const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('684ac8600032f6eccf56')

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);
const functions = new Functions(client);
const avatars = new Avatars(client);

// Export database instance and constants
export { databases };
export const DATABASE_ID = "6853a0910036fa92b87b"; // Updated database ID

export async function getAccount() {
  try {
    const acc = await account.get();
    console.log(acc)
    return acc;
  } catch (error) {
    return null;
  }
}
export let token = null;

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
    const scheme = `${deepLink.protocol}//`;

    const loginUrl =  account.createOAuth2Token(
      OAuthProvider.Github,
      Platform.OS==='web'?`${deepLink}/oauth-redirect`:`${deepLink}`,
      Platform.OS==='web'?`${deepLink}/oauth-redirect`:`${deepLink}`,
     ['repo','user']
     
    );

    if (Platform.OS === 'web') {
     
      window.location.href = loginUrl;
      
      return;
    } else {
     
      const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

      if (result.type === 'success' && result.url) {
        
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

export async function getAvatar(name) {
  const avatarUrl = await avatars.getInitials(name);
  return avatarUrl;
  
}

export async function createShowoff(showoff) {
  try{
  const user = await getCurrentUser();
  if (!user) throw new Error('Login required');
  return functions.createExecution('68712984002d57a98856', JSON.stringify(showoff));
}
catch (error) {
  console.log('Error creating showoff:', error);
  throw new Error(`Failed to create showoff: ${error.message}`);
}
}

export const EmailPassLogin = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    
    if (session) {
      console.log('Email/password session created:', session);
      return session;
    }
  } catch (error) {
    console.error('Error during email/password login:', error);
    throw new Error(`Login failed: ${error.message}`);
  }
}
export const EmailPassCreateAccount = async (name, email, password) => {

  try{
    const res = await account.create(ID.unique(), email, password, name);
    return res
  }
  catch (error) {
    console.error('Error during email/password account creation:', error);
    throw new Error(`Account creation failed: ${error.message}`);
  }
}

// Password Recovery Functions
export const createPasswordRecovery = async (email) => {
  try {
    // For web, use the current domain as redirect URL
    // For mobile, use a deep link that can be handled by the app
    let redirectUrl;
    
    if (Platform.OS === 'web') {
      // Use current domain for web
      redirectUrl = `${window.location.origin}/password-reset`;
    } else {
      // Use deep link for mobile apps
      const deepLink = new URL(makeRedirectUri());
      redirectUrl = `${deepLink}password-reset`;
    }
    
    const response = await account.createRecovery(email, redirectUrl);
    console.log('Password recovery initiated:', response);
    return response;
  } catch (error) {
    console.error('Error creating password recovery:', error);
    throw new Error(`Password recovery failed: ${error.message}`);
  }
}

export const confirmPasswordRecovery = async (userId, secret, newPassword) => {
  try {
    const response = await account.updateRecovery(userId, secret, newPassword);
    console.log('Password recovery confirmed:', response);
    return response;
  } catch (error) {
    console.error('Error confirming password recovery:', error);
    throw new Error(`Password recovery confirmation failed: ${error.message}`);
  }
}

export const handlePasswordResetRedirect = async () => {
  try {
    if (Platform.OS === 'web') {
      // Web: get params from window.location
      const params = new URLSearchParams(window.location.search);
      const secret = params.get('secret');
      const userId = params.get('userId');
      
      if (secret && userId) {
        // Clean up the URL by removing query parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        return { userId, secret };
      }
    } else {
      // Mobile: check for deep link
      const url = await Linking.getInitialURL();
      if (url) {
        const parsed = Linking.parse(url);
        const secret = parsed.queryParams?.secret;
        const userId = parsed.queryParams?.userId;
        
        if (secret && userId) {
          return { userId, secret };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error handling password reset redirect:', error);
    return null;
  }
}

export const loadIdentities = async () => {
  try {
    const result = await account.listIdentities([]);
    
    const githubIdentity = result.identities.find(identity => identity.provider === 'github');
    if (githubIdentity) {
      token = githubIdentity.providerAccessToken;
      return githubIdentity;
    }
    console.log('No GitHub identity found');
    
    return null;
  } catch (error) {
    console.log(`Error loading identities: ${error}`);
    // Return null on error
    return null;
  }
};

// Function to refresh token and identities
export const refreshToken = async () => {
  try {
    const identity = await loadIdentities();
    return identity;
  } catch (error) {
    console.log(`Error refreshing token: ${error}`);
    return null;
  }
};
export const startGithubLinking = async (scopes) => {
  try {
    
    
    const deepLink = new URL(makeRedirectUri());
    const scheme = `${deepLink.protocol}//`; 
    
    const loginUrl =  account.createOAuth2Token(
      OAuthProvider.Github,
      `${deepLink}`,
      `${deepLink}`,
      scopes
    );

    await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);
    
    
  } catch (e) {
    console.log('OAuth error:', e);
  }
};

export const SHOWOFF_BUCKET_ID = '688c76c10013852b5c48';

// Function to delete cover image from storage
export async function deleteCoverImage(fileId, userId) {
  try {
    await storage.deleteFile(SHOWOFF_BUCKET_ID, fileId);
    console.log('Cover image deleted successfully');
  } catch (error) {
    console.error('Error deleting cover image:', error);
    // Don't throw error as this is cleanup
  }
}

// Accepts asset object from Expo Image Picker or web File object
export async function uploadCoverImage(asset, userId) {
  try {
    console.log('Uploading asset:', asset)
    
    let fileObj
    if (Platform.OS === 'web' && asset.file) {
      // Web: Use the File object directly
      fileObj = asset.file
    } else {
      // Mobile: Create file object from asset
      fileObj = {
        uri: asset.uri,
        name: asset.fileName || `cover-${Date.now()}.jpg`,
        type: asset.mimeType,
        size: asset.fileSize, // optional
      }
    }
    
    const file = await storage.createFile(
      SHOWOFF_BUCKET_ID,
      ID.unique(),
      fileObj,
      [
        Permission.read(Role.any()),
        Permission.delete(Role.user(userId)),
        Permission.update(Role.user(userId))
      ]
    )
    console.log('File created:', file)
    
    let urlObj = storage.getFileViewURL(
      SHOWOFF_BUCKET_ID,
      file.$id
    )
    // Ensure url is a string
    let url = typeof urlObj === "string" ? urlObj : urlObj.href
    // Add project param if missing
    if (!url.includes("project=")) {
      const separator = url.includes("?") ? "&" : "?";
      url = `${url}${separator}project=684ac8600032f6eccf56`;
    }
    // Return both URL and file ID for potential deletion
    return { url, fileId: file.$id };
  } catch (error) {
    console.error('Error uploading cover image:', error);
    throw error;
  }
}
