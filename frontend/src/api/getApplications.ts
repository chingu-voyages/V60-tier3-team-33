export const getApplications = async () => {
    const res = await fetch("https://jobtracker-api.afuwapetunde.com/api/applications");
    const data = await res.json();

    return data;
}
