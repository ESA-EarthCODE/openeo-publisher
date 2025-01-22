import {capitalize, Chip} from "@mui/material";
import {OpenEOBackend, OpenEOJob} from "../lib/openeo/models";
import {DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridToolbar} from '@mui/x-data-grid';
import moment from "moment/moment";
import {useOpenEOJobs} from "../hooks/useOpenEOJobs";
import {Loading} from "@/components/Loading";
import {useOpenEOStore} from "../store/openeo";
import {useRouter} from "next/navigation";

interface JobTableProps {
    backend: OpenEOBackend;
}

export const JobTable = ({backend}: JobTableProps) => {

    const {data, error, loading} = useOpenEOJobs(backend);
    const { setSelectedJobs } = useOpenEOStore();

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
        setSelectedJobs(data.filter((j: OpenEOJob) => model.includes(j.id)))
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
        {
            loading && <Loading></Loading>
        }
        {data.length > 0 &&
            <DataGrid
                rows={data}
                columns={columns}
                initialState={{pagination: {paginationModel}}}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                slots={{toolbar: GridToolbar}}
                sx={{border: 0}}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionChange}
                data-testid='job-table'
            />
        }
        { !loading && data.length === 0 && <div data-testid='jobs-table-empty'>No jobs found</div>}
    </div>

}