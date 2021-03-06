import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";
import {cloneDeep} from "tailwindcss/lib/util/cloneDeep";

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      version: "2.0"
    })
  ],
  callbacks: {
    async jwt({token, user, account, profile, isNewUser}) {
      if (profile) {
        token['twitter'] = profile.data;
      }

      if (account) {
        token['credentials'] = {
          authToken: account.oauth_token,
          authSecret: account.oauth_token_secret,
        };
      }

      return token
    },
    async session({session, token, user}) {
      // Send properties to the client, like an access_token from a provider.
      //let userData = cloneDeep(token.twitterHandle);
      //delete userData.userID;
      session.twitter = token.twitter;
      return session;
  
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: '/error', // Error code passed in query string as ?error=
}
});
