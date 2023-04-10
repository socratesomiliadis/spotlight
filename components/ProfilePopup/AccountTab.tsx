import { UserProfile } from "@clerk/nextjs";

export default function AccountTab() {
  return (
    <UserProfile
      routing="virtual"
      appearance={{
        variables: {
          colorPrimary: "#000",
        },
        elements: {
          rootBox: {
            width: "100%",
            height: "100%",
          },
          scrollBox: {
            height: "100%",
          },
          profileSection__profile: {
            display: "none",
          },
          profileSection__username: {
            display: "none",
          },
          pageScrollBox: {
            padding: "0 0.75rem 0rem 0.75rem",
            height: "100%",
          },
          card: {
            width: "100%",
            height: "100%",
            boxShadow: "none",
            margin: "0",
            position: "relative",
          },
          navbar: {
            display: "none",
          },
          navbarButtons: {
            position: "sticky",
            top: "0",
          },
          header: {
            display: "none",
          },
        },
      }}
    />
  );
}
