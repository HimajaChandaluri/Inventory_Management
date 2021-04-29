// import React, { useState, useEffect, forwardRef } from "react";
// import FirstPage from "@material-ui/icons/FirstPage";
// import LastPage from "@material-ui/icons/LastPage";
// import Edit from "@material-ui/icons/Edit";
// import ChevronLeft from "@material-ui/icons/ChevronLeft";
// import ChevronRight from "@material-ui/icons/ChevronRight";
// import Search from "@material-ui/icons/Search";
// import FilterList from "@material-ui/icons/FilterList";
// import MaterialTable from "material-table";
// import Clear from "@material-ui/icons/Clear";
// import PropTypes from "prop-types";
// import ArrowUpward from "@material-ui/icons/ArrowUpward";
// import SaveAlt from "@material-ui/icons/SaveAlt";
// import Check from "@material-ui/icons/Check";
// import Input from "@material-ui/core/Input";

// const tableIcons = {
//   FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
//   LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
//   NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
//   PreviousPage: forwardRef((props, ref) => (
//     <ChevronLeft {...props} ref={ref} />
//   )),
//   Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
//   Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
//   ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
//   SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
//   Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
//   Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
//   Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
//   Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
// };

// const AddReturnView = ({ className, ...rest }) => {
//   const [allOutward, setAllOutward] = useState([]);
//   const [columns_array, setColsArray] = useState([]);
//   useEffect(() => {
//     fetch("/api/getOutward", {})
//       .then((res) => res.json())
//       .then((result) => {
//         console.log("result = ", columns_array);
//         if (result.outward[0] != null) {
//           var cols = Object.keys(result.outward[0]);
//           //cols = cols.filter((item) => item !== "nick_name" &&  item !=="createdAt" && item !=="identifier" && item !=="type");
//           cols.map((x) => {
//             if (x === "return_quantity") {
//               columns_array.push({
//                 title: x,
//                 field: x,
//                 editComponent: (props) => (
//                   <Input
//                     defaultValue={props.value}
//                     onChange={(e) => props.onChange(e.target.value)}
//                     type="number"
//                   />
//                 ),
//                 //customFilterAndSearch: (term, rowData) => rowData.available_quantity < rowData.threshold_quantity
//               });
//             } else {
//               columns_array.push({ title: x, field: x });
//             }
//           });
//           console.log("Columns Array", cols);
//           setAllOutward(result.outward);
//         }
//       });
//   }, []);
//   return (
//     <div className="dashBoard">
//       <hr />
//       <MaterialTable
//         title="Add Returns"
//         columns={columns_array.map((c) => ({ ...c, tableData: undefined }))}
//         data={allOutward.map((item) => Object.assign({}, item))}
//         icons={tableIcons}
//         localization={{
//           header: {
//             actions: "",
//           },
//         }}
//         options={{
//           filtering: true,
//           sorting: true,
//           pageSize: 5,
//           paginationType: "stepped",
//         }}
//         editable={{
//           isDeleteHidden: (allOutward) => allOutward.name !== "y",
//           onBulkUpdate: (changes) =>
//             new Promise((resolve, reject) => {
//               setTimeout(async () => {
//                 const updated_resources = [];
//                 console.log("newData", changes);
//                 for (var i in changes) {
//                   if (
//                     changes[i].newData.return_quantity <=
//                       changes[i].newData.quantity &&
//                     changes[i].oldData.return_quantity <
//                       changes[i].newData.return_quantity
//                   )
//                     updated_resources.push({
//                       outward_sequence: changes[i].newData.outward_sequence,
//                       return_quantity:
//                         changes[i].newData.return_quantity -
//                         changes[i].oldData.return_quantity,
//                       new_return: changes[i].newData.return_quantity,
//                     });
//                   console.log("updated_resources", updated_resources[0]);
//                 }
//                 setTimeout(() => {
//                   fetch("/api/updateReturnedResource", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ updated_resources }),
//                   })
//                     .then((res) => {
//                       if (res.ok) {
//                         alert("Updated Successfully ");
//                         window.location.reload(false);
//                       } else {
//                         alert("There was an error, please try later");
//                       }
//                     })
//                     .catch(() => alert("There was a error, Please try again"));
//                 }, 100);
//                 resolve();
//               }, 100);
//             }),
//           onRowDelete: (oldData) =>
//             new Promise((resolve, reject) => {
//               setTimeout(() => {
//                 resolve();
//               }, 1000);
//             }),
//         }}
//       />
//     </div>
//   );
// };

// AddReturnView.propTypes = {
//   className: PropTypes.string,
// };

// export default AddReturnView;

import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { Formik, useField, FieldArray } from "formik";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Page from "../../../components/Page";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));
const AddReturnView = ({ className, ...rest }) => {
  const classes = useStyles();
  var today = new Date().toISOString().slice(0, 10);
  const [allResources, setAllResources] = useState([]);
  const [allPersons, setAllPersons] = useState([]);

  const [selectedResource, setSelectedResource] = useState([]);
  const handleResourceChange = (selectedResource, values) => {
    values.resource = selectedResource.value;
    values.outward_sequence = selectedResource.outward_sequence;
    setSelectedResource(selectedResource);
  };

  const [locations, setAllLocations] = useState([]);
  useEffect(() => {
    fetch("/api/getAllLocations", {})
      .then((res) => res.json())
      .then((result) => {
        var x = [];
        for (var i in result.locations) {
          x.push({
            label: result.locations[i].name,
            value: result.locations[i].name,
          });
        }
        setAllLocations(x);
      });
  }, [locations]);

  useEffect(() => {
    fetch("/api/getOutward", {})
      .then((res) => res.json())
      .then((result) => {
        var x = [];
        for (var i in result.outward) {
          x.push({
            label:
              result.outward[i].outward_sequence +
              "-" +
              result.outward[i].resource +
              "(" +
              result.outward[i].quantity +
              ")",
            value: result.outward[i].resource,
            outward_sequence: result.outward[i].outward_sequence,
          });
        }
        setAllResources(x);
      });
  }, []);

  useEffect(() => {
    fetch("/api/getAllPersons", {})
      .then((res) => res.json())
      .then((result) => {
        setAllPersons(result.persons);
      });
  }, []);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "#f4f6f8",
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      // Overwrittes the different states of border
      borderColor: state.isFocused ? "yellow" : "green",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "red" : "blue",
      },
      paddingTop: 5,
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      zIndex: 9999,
      // kill the gap
      marginTop: 0,
      background: "light blue",
    }),
    menuList: (base) => ({
      ...base,

      // kill the white space on first and last option
      padding: 10,
    }),
  };

  return (
    <Page className={classes.root} title="Add Outward">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              resource: "",
              transportedBy: "",
              returnedBy: "",
              date: today,
              quantity: "",
              outward_sequence: "",
            }}
            validationSchema={Yup.object().shape({
              resource: Yup.string()
                .max(255)
                .required("Resource is required"),
              transportedBy: Yup.string()
                .max(255)
                .required("Transported By is required"),
              returnedBy: Yup.string()
                .max(255)
                .required("Returned By are required"),
              quantity: Yup.string().required("Quantity is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setTimeout(() => {
                fetch("/api/updateReturnedResource", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ values }),
                })
                  .then((res) => {
                    if (res.ok) {
                      res.text().then((x) => alert(x));
                    } else {
                      alert("There was an errror");
                    }
                    setSubmitting(false);
                    resetForm({});
                  })
                  .catch(() => alert("There was a error, Please try again"));
              }, 1000);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                {/* <Box mb={1}> */}
                <Typography color="textPrimary" variant="h2">
                  RETURNS
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12}></Grid>
                  <Grid item md={4} xs={12}>
                    <TextField
                      error={Boolean(touched.date && errors.date)}
                      fullWidth
                      helperText={touched.Date && errors.Date}
                      type="date"
                      margin="normal"
                      name="date"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.date}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={4} xs={12}></Grid>
                </Grid>

                <TextField
                  fullWidth
                  name="transportedBy"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.transportedBy}
                  variant="outlined"
                  margin="normal"
                  label="Transported By"
                >
                  <option value="" />
                  {allPersons.map((option) => (
                    <option
                      key={option.first_name + "-" + option.last_name}
                      value={option.first_name + "-" + option.last_name}
                    >
                      {option.first_name +
                        "-" +
                        option.last_name +
                        "(" +
                        option.role +
                        ")"}
                    </option>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  name="returnedBy"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.returnedBy}
                  variant="outlined"
                  margin="normal"
                  label="Returned By"
                >
                  <option value="" />
                  {allPersons.map((option) => (
                    <option
                      key={option.first_name + "-" + option.last_name}
                      value={option.first_name + "-" + option.last_name}
                    >
                      {option.first_name +
                        "-" +
                        option.last_name +
                        "(" +
                        option.role +
                        ")"}
                    </option>
                  ))}
                </TextField>

                <Select
                  name="resource"
                  fullWidth
                  onChange={(selectedOption) => {
                    handleResourceChange(selectedOption, values);
                    handleChange("resource");
                  }}
                  isClearable
                  SelectProps={{ native: true }}
                  options={allResources}
                  required
                  defaultValue={{ label: "Outward Sequence", value: "" }}
                  variant="outlined"
                  margin="normal"
                  styles={customStyles}
                />

                <TextField
                  fullWidth
                  required
                  label="Return Quantity"
                  type="number"
                  size="small"
                  margin="normal"
                  name="quantity"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  value={values.quantity}
                  variant="outlined"
                />

                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    SAVE
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default AddReturnView;
