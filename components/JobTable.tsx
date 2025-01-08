import {capitalize, Chip} from "@mui/material";
import {OpenEOJob} from "../lib/openeo/models";
import {
    DataGrid,
    GridCallbackDetails,
    GridColDef,
    GridRenderCellParams,
    GridRowSelectionModel,
    GridToolbar
} from '@mui/x-data-grid';
import moment from "moment/moment";

interface JobTableProps {
    jobs: OpenEOJob[];
    setSelectedJobs: (jobs: OpenEOJob[]) => void;
}

export const JobTable = ({jobs, setSelectedJobs}: JobTableProps) => {

    const getChipColor = (status?: string): string => {
        switch (status) {
            case 'finished':
                return 'success';
            case 'created':
            case 'queued':
                return 'primary';
            case 'canceled':
                return 'warning'
            case 'error':
                return 'error'
            default:
                return 'default'
        }
    }

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        setSelectedJobs(jobs.filter((j: OpenEOJob) => model.includes(j.id)))
    }

    const columns: GridColDef[] = [
        {
            field: 'created', headerName: 'Created', width: 200, type: 'dateTime',
            valueGetter: (value) => new Date(value),
            valueFormatter: (value?: Date) => {
                if (value == null) {
                    return '';
                }
                return moment(value).format('DD MMM YYYY HH:mm:ss');
            }
        },
        {field: 'title', headerName: 'Title', flex: 1},
        {
            field: 'status', headerName: 'Status', width: 150,
            renderCell: (params: GridRenderCellParams<any, string>) => (
                    <Chip
                        color={getChipColor(params.value)}
                        label={capitalize(params.value || 'Unknown')}
                    >
                    </Chip>
            ),
        },
    ];

    const paginationModel = {page: 0, pageSize: 20};

    return <div>
        <DataGrid
            rows={jobs}
            columns={columns}
            initialState={{pagination: {paginationModel}}}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            slots={{toolbar: GridToolbar}}
            sx={{border: 0}}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
        />
    </div>

}