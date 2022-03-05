import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable, { MTableBodyRow } from "@material-table/core";
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
  }, [id]);

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
        <h5 className="my-2 ms-3">You currently have <DecoCounter id={id}/> of this decoration.</h5>
      </div>
      <div className="m-4">
        <ThemeProvider theme={theme}>
          <MaterialTable
            title="Skill(s)"
            columns={skillColumns} 
            data={decoration.skills}
            onRowClick={(event, data) => {
              nav(`/skills/${data.id}`)
            }}
            components={{
              Row: props => <MTableBodyRow id={props.data.element} {...props} />
            }}
            options={{
              paging:false,
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