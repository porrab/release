import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hook";
import { fetchReleases } from "../../features/jira/jiraSlice";
import ReleaseList from "./component/ReleaseList";
import { Grid, Stack, Typography } from "@mui/material";

export default function Home() {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.releases);

  useEffect(() => {
    dispatch(fetchReleases());
  }, [dispatch]);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <Typography variant="h4">Release</Typography>
      <Grid
        container
        spacing={2}
        alignItems="flex-start"
        sx={{ marginTop: "15px" }}
      >
        <ReleaseList releases={data} isLoading={false}></ReleaseList>
      </Grid>
    </>
  );
}
