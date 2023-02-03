import * as React from "react";
import dayjs from "dayjs";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { Autoplay } from "swiper";
import "swiper/css";
const currencies = [
  {
    value: "100000",
    label: "1000",
  },
  {
    value: "200000",
    label: "2000",
  },
  {
    value: "300000",
    label: "3000",
  },
  {
    value: "500000",
    label: "5000",
  },
];
function App() {
  const [age, setAge] = React.useState("");
  const [clusterList, setClusterList] = React.useState([]);
  const [clusterId, setClusterId] = React.useState("");
  const [sponsersList, setSponsersList] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [name, setName] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const [batch, setBatch] = React.useState(null);
  const [branch, setBranch] = React.useState(null);
  const [dob, setDob] = React.useState(
    dayjs("2014-08-18T21:11:54").format("DD/MM/YYYY") ?? ""
  );

  const handleSetClusterId = (value) => {
    setClusterId(value);
    handleGetSponsorsList(value);
  };

  const changePage = (page) => {
    setPage(page);
  };

  const handleSetName = (event) => {
    setName(event.target.value);
  };
  const handleSetAmount = (event) => {
    setAmount(event.target.value);
  };
  const handleSetBatch = (event) => {
    setBatch(event.target.value);
  };

  const handleSetBranch = (event) => {
    setBranch(event.target.value);
  };
  const validation = () => {
    if (name == null) {
      alert("Please enter name");
      return false;
    } else if (batch == null) {
      alert("Please enter batch");
      return false;
    } else if (amount == null) {
      alert("Please enter amount");
      return false;
    } else if (branch == null) {
      alert("Please enter branch");
      return false;
    } else if (dob == null) {
      alert("Please enter dob");
      return false;
    } else if (clusterId == "") {
      alert("Please select campus");
      return false;
    }
    return true;
  };
  const handleGetSponsoredCampusList = () => {
    axios
      .get(process.env.REACT_APP_ESAMUDAAY_URL + "/api/v1/clusters/", {
        headers: {
          Authorization: "JWT " + process.env.REACT_APP_TOKEN,
          TPID: process.env.REACT_APP_TPID,
        },
        params: {
          sponsorship_enabled: true,
        },
      })
      .then((response) => {
        setClusterList(response.data);
      })
      .catch(function (error) {
        alert("Unauthorize or slow internet");
      });
  };
  const handleGetSponsorsList = (clusterId) => {
    axios
      .get(
        process.env.REACT_APP_ESAMUDAAY_URL +
          "/api/v1/clusters/" +
          clusterId +
          "/sponsor",
        {
          headers: {
            Authorization: "JWT " + process.env.REACT_APP_TOKEN,
            // TPID: process.env.REACT_APP_TPID,
          },
          params: {
            page: page,
          },
        }
      )
      .then((response) => {
        setSponsersList(response.data.results);
        console.log(
          `sponsers list = > ${JSON.stringify(response.data.results)}`
        );
      })
      .catch(function (error) {
        alert("Unauthorize or slow internet");
      });
  };
  const postDonationDetails = (clusterId) => {
    const data = {
      name: name,
      amount: amount,
      batch: batch,
      branch: branch,
      dob: dob.toString(),
    };
    if (validation() == true) {
      axios
        .post(
          process.env.REACT_APP_ESAMUDAAY_URL +
            "/api/v1/clusters/" +
            clusterId +
            "/sponsor",
          data,
          {
            headers: {
              Authorization: "JWT " + process.env.REACT_APP_TOKEN,
              // TPID: process.env.REACT_APP_TPID,
            },
          }
        )
        .then((response) => {
          window.open(response.data.payment_link.short_url, "_blank");
          setName(null);
          setAmount(null);
          setBatch(null);
          setBranch(null);
        })
        .catch(function (error) {
          alert("Unauthorize or slow internet");
        });
    }
  };
  const rows = sponsersList.map((item) => {
    return {
      name: item.name,
      amount: item.amount / 100,
      branch: item.branch,
      batch: item.batch,
    };
  });
  React.useEffect(() => {
    handleGetSponsoredCampusList();
  }, []);

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: "#ffff" }}>
          <Toolbar>
            <Typography
              style={{ color: "#000000", fontWeight: "bold" }}
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              NITK Connect
            </Typography>
            <div style={{ padding: "12px" }}>
              <TextField
                id="outlined-select-currency"
                select
                label="Select Campus"
                defaultValue="Select Campus"
                helperText="Please select your Campus to see sponsors list"
              >
                {clusterList.map((option) => (
                  <MenuItem
                    key={option.cluster_id}
                    onClick={() => handleSetClusterId(option.cluster_id)}
                    value={option.cluster_id}
                  >
                    {option.cluster_name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </Toolbar>
        </AppBar>
        <Swiper
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          // modules={[Pagination]}
          className="mySwiper"
          style={{ marginTop: "16px" }}
        >
          <SwiperSlide>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                height={600}
                src="https://media.esamudaay.com/user-media/WhatsApp_Image_2023-02-03_at_21.02.00.jpeg"
              ></img>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            {" "}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                height={600}
                src="https://media.esamudaay.com/user-media/WhatsApp_Image_2023-02-03_at_21.01.59_1.jpeg"
              ></img>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            {" "}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                height={600}
                src="https://media.esamudaay.com/user-media/WhatsApp_Image_2023-02-03_at_21.01.59.jpeg"
              ></img>
            </div>
          </SwiperSlide>
        </Swiper>
        <Box>
          <Container>
            <Box>
              <Typography
                textAlign="center"
                style={{ fontSize: "24px", padding: "20px" }}
              >
                Donation Form
              </Typography>
              <Box style={{ display: "flex", justifyContent: "center" }}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                  }}
                >
                  <div>
                    <TextField
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      onChange={handleSetName}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Batch"
                      variant="outlined"
                      onChange={handleSetBatch}
                    />
                  </div>
                  <div>
                    <TextField
                      id="outlined-basic"
                      label="Branch"
                      variant="outlined"
                      onChange={handleSetBranch}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Date of Birth"
                        inputFormat="DD/MM/YYYY"
                        value={dob ?? ""}
                        onChange={setDob}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                  <div>
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Amount"
                      defaultValue="Select Amount"
                      helperText="Please select your Donation amount"
                      onChange={handleSetAmount}
                    >
                      {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <Button
                    variant="contained"
                    onClick={() => postDonationDetails(clusterId)}
                  >
                    Donate now
                  </Button>
                </Box>
              </Box>
            </Box>
            <TableContainer component={Paper} style={{ margin: "20px" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Sponsor's Name
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Sponsored Amount
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Branch
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Batch
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                      <TableCell align="right">{row.branch}</TableCell>
                      <TableCell align="right">{row.batch}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center">
              <Pagination
                style={{
                  paddingTop: "20px",
                  scrollPaddingBottom: "20px",
                  alignContent: "center",
                }}
                count={Math.ceil(sponsersList / 20)}
                page={parseInt(page)}
                onChange={changePage}
                showFirstButton
                showLastButton
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </div>
  );
}

export default App;
