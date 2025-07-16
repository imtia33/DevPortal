import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { handleOAuthRedirect } from '../backend/appwrite';
import { useAppwriteContext } from '../context/appwriteContext';

export default function OAuthRedirect() {
  const { setUser, setIsLogged } = useAppwriteContext();
  const [loginFailed, setLoginFailed] = useState(false);

  useEffect(() => {
    const createSession = async () => {
      const res = await handleOAuthRedirect();

      if (res) {
        router.replace('/screens');
        setUser(res);
        setIsLogged(true);
      } else {
        setLoginFailed(true);
        // Optionally, you can delay before redirecting or let user retry
        router.replace('/Introduction');
      }
    };
    createSession();
  }, []);

  return (
    <View style={styles.container}>
      {!loginFailed ? (
        <>
          <ActivityIndicator size="large" color="#FD366E" />
          <Text style={styles.text}>Signing you in...</Text>
        </>
      ) : (
        <Text style={styles.errorText}>
          Login failed. Please try again.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#19191D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    color: '#FD366E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 16,
    color: '#FF4C4C',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});