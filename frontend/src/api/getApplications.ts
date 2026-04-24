export const getApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "https://jobtracker-api.afuwapetunde.com/api/applications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  const { data } = await res.json();

  return data;
};
