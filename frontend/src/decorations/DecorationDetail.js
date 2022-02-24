import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from "@material-table/core";
import { ThemeProvider, createTheme } from "@material-ui/core";
import PlusButton from "../common/PlusButton";
import MinusButton from "../common/MinusButton";
import DecoCounter from "../common/DecoCounter";

const DecorationDetail = ({plus, minus}) => {
  const [decoration, setDecoration] = useState({});
  const { id } = useParams();
  const nav = useNavigate();
  const skillColumns = [
    {title:"Skill", field:"name", width:"15%"},
    {title:"Level", field:"level", width:"10%"},
    {title:"Description", field:"description"}
  ];
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });

  useEffect(function fetchDecoWhenMounted () {
    async function fetchDeco() {
      const res = await MhwApi.getOne("decorations", id);
      setDecoration(res);
    }
    fetchDeco();
  }, []);

  if (!decoration.skills) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="container">
      <div className="col-sm-12 d-flex">
        <h1 className="m-3">{decoration.name}</h1>
        <PlusButton id={id} spacing="mx-1 px-2 my-4" plus={plus}/>
        <MinusButton id={id} spacing="mx-1 px-2 my-4" minus={minus}/>
      </div>
      <div className="d-flex">
        <p className="d-inline-block mx-1">You currently have </p><DecoCounter id={id}/><p className="d-inline-block mx-1"> of this decoration.</p>
      </div>
      <div className="container my-5">
        <ThemeProvider theme={theme}>
          <MaterialTable
            title="Skill(s)"
            columns={skillColumns} 
            data={decoration.skills}
            onRowClick={(event, data) => {
              nav(`/skills/${data.id}`)
            }}
            options={{
              pageSize:3,
              search:false,
              filtering:false,
              tableLayout:"fixed"
            }}
          />
        </ThemeProvider>
      </div>
    </div>
  )
}

export default DecorationDetail;