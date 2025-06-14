import axiosInstace from "@/services/axios";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import * as React from "react";

export function withAuth(WrappedComponent: any) {
  return function WithAuth(props: any) {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);

    React.useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/");
          return;
        }

        try {
          const res = await axiosInstace.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            useAuthStore.getState().login(res.data.data, token);
          } else {
            router.push("/");
          }
        } catch (error) {
          router.push("/");
        }
      };

      if (!user) {
        checkAuth();
      }
    }, [router, user]);

    return <WrappedComponent {...props} />;
  };
}
