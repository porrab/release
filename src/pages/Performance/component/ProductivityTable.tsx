import { useMemo } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import type { Productivity } from "../../../types/productivitySquad";

const ProductivityTable = ({ data }: { data: Productivity[] }) => {
  const columns = useMemo<MRT_ColumnDef<Productivity>[]>(
    () => [
      {
        header: "Squad",
        columns: [
          {
            accessorKey: "squadProductivity.verticals",
            header: "Verticals",
            size: 200,
            grow: true,
          },
          {
            accessorKey: "squadProductivity.release",
            header: "Release",
            size: 200,
          },
        ],
      },
      {
        header: "Tasks",
        columns: [
          {
            accessorKey: "tasks.noOfSprints",
            header: "Squad",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "tasks.noOfDev",
            header: "Devs",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "tasks.noOfTickets",
            header: "Tickets",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "tasks.noOfSubtasks",
            header: "Subtasks",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "tasks.maxTimeSpentHours",
            header: "Max Hours",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "tasks.totalTasksComplete",
            header: "Total Completed",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
        ],
      },
      {
        header: "Defects",
        columns: [
          {
            accessorKey: "defects.sitWeight",
            header: "SIT Weight",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(), // raw value
          },
          {
            accessorKey: "defects.sitSize",
            header: "SIT Size",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "defects.totalSitDefects",
            header: "Total Defects",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
        ],
      },
      {
        header: "Working Hours",
        columns: [
          {
            accessorKey: "workingHours.workingTimeRatio",
            header: "Work Ratio",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "workingHours.timeSpentHours",
            header: "Time Spent (h)",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "workingHours.totalWorkingHours",
            header: "Total Working (h)",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
        ],
      },
      {
        header: "Story Points",
        columns: [
          {
            accessorKey: "storyPoints.totalStoryPointsWithSubtasks",
            header: "Total SP w/ Subtasks",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "storyPoints.storyPoints",
            header: "Story Points",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },

          {
            accessorKey: "storyPoints.averageStoryPoint",
            header: "Avg SP",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
        ],
      },
      {
        header: "Productivity",
        columns: [
          {
            accessorKey: "productivityScore.rawScore",
            header: "Raw Score",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "productivityScore.adjustScore",
            header: "Adjusted Score",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
          {
            accessorKey: "productivityScore.finalGrade",
            header: "Grade",
            size: 200,
            Cell: ({ cell }) => String(cell.getValue<string>() ?? ""),
          },
        ],
      },
      {
        header: "Multiply Ratio",
        columns: [
          {
            accessorKey: "multiplyRatio",
            header: "Multiplier",
            size: 200,
            Cell: ({ cell }) => cell.getValue<number>(),
          },
        ],
      },
    ],
    [],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnResizing
      enableRowActions
      enableSorting
      enableColumnFilters
      enablePagination
      initialState={{
        density: "comfortable",
        pagination: { pageSize: 25, pageIndex: 0 },
      }}
      muiTableBodyCellProps={{
        sx: {
          whiteSpace: "normal",
          wordBreak: "break-word",
        },
      }}
      renderRowActionMenuItems={({ row, table }) => [
        <Tooltip key="info" title="Details">
          <IconButton
            onClick={() => {
              table.setExpanded({ [row.id]: true });
            }}
            size="small"
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>,
        <Tooltip key="edit" title="Edit">
          <IconButton
            onClick={() => console.log("edit", row.original)}
            size="small"
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>,
        <Tooltip key="export" title="Export row">
          <IconButton
            onClick={() => {
              const payload = JSON.stringify(row.original, null, 2);
              console.log("export row", payload);
            }}
            size="small"
          >
            <DownloadOutlinedIcon />
          </IconButton>
        </Tooltip>,
      ]}
      renderDetailPanel={({ row }) => (
        <Box sx={{ padding: 2, backgroundColor: "background.paper" }}>
          <Typography variant="subtitle2" gutterBottom>
            Detailed JSON
          </Typography>
          <Box
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 12,
              backgroundColor: "grey.100",
              padding: 1,
              borderRadius: 1,
            }}
          >
            {JSON.stringify(row.original, null, 2)}
          </Box>
        </Box>
      )}
      muiTablePaperProps={{
        elevation: 0,
        sx: {
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
        },
      }}
      positionActionsColumn="last"
      enableStickyHeader
      enableRowVirtualization
    />
  );
};

export default ProductivityTable;
