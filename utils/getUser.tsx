import { useEffect, useState, createContext, useContext } from "react";
import { useUser as useClerkUser, useAuth } from "@clerk/nextjs";
import { supabaseClientWithAuth } from "./helpers";
import { UserDetails, Subscription } from "@/types";
import { useSession } from "@clerk/nextjs";

type UserContextType = {
  user: any | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const { isLoaded, getToken, userId } = useAuth();

  const user = useClerkUser();
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const getUserDetails = async () => {
    const token = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(token as string);
    return supabase.from("profile").select("*").eq("user_id", userId).single();
  };
  const getSubscription = async () => {
    const token = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(token as string);
    return supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();
  };

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsloadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailsPromise.status === "fulfilled")
            setUserDetails(userDetailsPromise.value.data as UserDetails);

          if (subscriptionPromise.status === "fulfilled")
            setSubscription(subscriptionPromise.value.data as Subscription);

          setIsloadingData(false);
        }
      );
    } else if (!user && isLoaded && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoaded]);

  const value = {
    user,
    userDetails,
    isLoading: !isLoaded || isLoadingData,
    subscription,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
