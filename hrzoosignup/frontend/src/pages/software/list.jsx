import React, { useContext, useState, useEffect } from 'react';
import { SharedData } from '../root';
import { Col, Row, Table, Input } from 'reactstrap';
import { PageTitle } from '../../components/PageTitle';
import { fetchScienceSoftware } from '../../api/software';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { HZSIPagination, TablePaginationHelper, EmptyTable } from "../../components/TableHelpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


const sortArrow = (descending=undefined) => {
  if (descending === true)
    return (
      <span>{' '}&uarr;</span>
    )
  else if (descending === false)
    return (
      <span>&darr;{' '}</span>
    )
  else
    return (
      <>
        <span>&uarr;</span>
        <span>&darr;</span>
      </>
    )
}


const SoftwareListTable = ({pageTitle, data}) => {
  const [pageSize, setPageSize] = useState(30)
  const [pageIndex, setPageIndex] = useState(0)
  const [sortName, setSortName] = useState(undefined)

  const { control, setValue } = useForm({
    defaultValues: {
      applications: data,
      searchName: "",
    }
  })

  const searchName = useWatch({ control, name: "searchName" })
  const { fields } = useFieldArray({ control, name: "applications" })

  let fieldsView = fields

  let paginationHelp = new TablePaginationHelper(fieldsView.length, pageSize, pageIndex)

  if (searchName)
    fieldsView = fieldsView.filter(e => e.name.toLowerCase().includes(searchName.toLowerCase()))

  paginationHelp.searchNum = fieldsView.length
  paginationHelp.isSearched = searchName === true

  fieldsView = fieldsView.slice(paginationHelp.start, paginationHelp.end)

  return (
    <>
      <Row>
        <PageTitle pageTitle={pageTitle}/>
      </Row>
      <Row>
        <Col>
          <Table responsive hover className="shadow-sm">
            <thead id="hzsi-thead" className="align-middle text-center text-white">
              <tr className="border-bottom border-dark">
                <th className="fw-normal"  style={{width: '52px'}}>
                  #
                </th>
                <th className="fw-normal border-0 d-flex justify-content-center"  style={{minWidth: '286px', cursor: 'pointer'}}
                  onClick={() => {
                    setSortName(!sortName)
                  }}
                >
                  <div className="flex-grow-1">
                    Ime modulefilea
                  </div>
                  <div>
                    { sortArrow(sortName) }
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 align-middle text-center">
                  <FontAwesomeIcon icon={ faSearch } />
                </td>
                <td className="p-2 align-middle text-center">
                  <Controller
                    name="searchName"
                    control={ control }
                    render={ ({ field }) =>
                      <Input
                        { ...field }
                        placeholder="Traži"
                        className="form-control"
                        style={{fontSize: '0.83rem'}}
                      />
                    }
                  />
                </td>
              </tr>
              {
                fieldsView.length > 0 ?
                  fieldsView.map((application, index) =>
                    <tr key={index}>
                      <td className="p-3 align-middle text-center">
                        { pageIndex * pageSize + index + 1 }
                      </td>
                      <td className="p-3 align-middle text-center fw-bold">
                        <Row>
                          <Col>
                            { application.name }
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  )
                :
                  data.length > 0 && searchName ?
                    <EmptyTable colspan="7" msg="Nijedan modulefile ne zadovoljava pretragu" />
                  :
                    <EmptyTable colspan="7" msg="Nema modulefilea na klasteru" />
              }
            </tbody>
          </Table>
        </Col>
      </Row>
      <HZSIPagination
        pageIndex={ pageIndex }
        pageSize={ pageSize }
        setPageIndex={ setPageIndex }
        setPageSize={ setPageSize }
        pageCount={ paginationHelp.pageCount }
        start={ paginationHelp.start }
        choices={ paginationHelp.choices }
        resource_name="korisnika"
      />
    </>
  )
}


export const SoftwareList = () => {
  const { LinkTitles } = useContext(SharedData);
  const [pageTitle, setPageTitle] = useState(undefined);

  const { status, data} = useQuery({
    queryKey: ['science-software-list'],
    queryFn: fetchScienceSoftware,
  })

  useEffect(() => {
    setPageTitle(LinkTitles(location.pathname))
  }, [location.pathname])

  if (status === 'success')
    return <SoftwareListTable pageTitle={pageTitle} data={data}/>
};
