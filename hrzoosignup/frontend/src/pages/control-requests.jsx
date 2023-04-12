import React, { useContext, useState, useEffect } from 'react';
import { SharedData } from './root';
import { Col, Row, Table, Tooltip, Badge, Button } from 'reactstrap';
import { PageTitle } from '../components/PageTitle';
import { StateIcons, StateString } from '../config/map-states';
import { fetchAllNrProjects } from '../api/projects';
import { useQuery } from '@tanstack/react-query';
import { TypeString, TypeColor } from '../config/map-projecttypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { convertToEuropean } from '../utils/dates';


const ControlRequests = () => {
  const { LinkTitles } = useContext(SharedData);
  const [pageTitle, setPageTitle] = useState(undefined);

  const {status, data: nrProjects, error, isFetching} = useQuery({
      queryKey: ['all-projects'],
      queryFn: fetchAllNrProjects
  })

  const [tooltipOpened, setTooltipOpened] = useState(undefined);
  const showTooltip = (toolid) => {
    let showed = new Object()
    if (tooltipOpened === undefined && toolid) {
      showed[toolid] = true
      setTooltipOpened(showed)
    }
    else {
      showed = JSON.parse(JSON.stringify(tooltipOpened))
      showed[toolid] = !showed[toolid]
      setTooltipOpened(showed)
    }
  }
  const isOpened = (toolid) => {
    if (tooltipOpened !== undefined)
      return tooltipOpened[toolid]
  }

  useEffect(() => {
    setPageTitle(LinkTitles(location.pathname))
  }, [location.pathname])

  if (nrProjects?.length > 0)
    return (
      <>
        <Row>
          <PageTitle pageTitle={pageTitle}/>
        </Row>
        <Row>
          <Col>
            <Table responsive hover className="shadow-sm">
              <thead id="hzsi-thead" className="table-active align-middle text-center text-white">
                <tr className="border-bottom border-2 border-dark">
                  <th className="fw-normal">
                    Stanje
                  </th>
                  <th className="fw-normal">
                    Tip
                  </th>
                  <th className="fw-normal">
                    Šifra
                  </th>
                  <th className="fw-normal">
                    Naziv
                  </th>
                  <th className="fw-normal">
                    Voditelj
                  </th>
                  <th className="fw-normal">
                    Podnesen
                  </th>
                  <th className="fw-normal">
                    Radnje
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  nrProjects.map((project, index) =>
                    <tr key={index}>
                      <td className="p-3 align-middle text-center" id={'Tooltip-' + index}>
                        { StateIcons(project.state.name) }
                        <Tooltip
                          placement='top'
                          isOpen={isOpened(project.identifier)}
                          target={'Tooltip-' + index}
                          toggle={() => showTooltip(project.identifier)}
                        >
                          { StateString(project.state.name) }
                        </Tooltip>
                      </td>
                      <td className="align-middle text-center">
                        <span className={`badge ${TypeColor(project.project_type.name)}`} >
                          { TypeString(project.project_type.name) }
                        </span>
                      </td>
                      <td className="p-3 align-middle text-center">
                        <Badge color="secondary">{ project.identifier }</Badge>
                      </td>
                      <td className="p-3 align-middle fw-bold text-center">
                        { project.name}
                      </td>
                      <td className="p-3 align-middle fw-bold text-center">
                        { project.name }
                      </td>
                      <td className="align-middle text-center fs-6 font-monospace">
                        { convertToEuropean(project.date_submitted) }
                      </td>
                      <td className="align-middle text-center">
                        <Button color="light">
                          <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Button>
                      </td>
                    </tr>
                  )
                }
                {
                  nrProjects.length < 5 && [...Array(5 - nrProjects.length)].map((_, i) =>
                    <tr key={i + 5}>
                      <td colSpan="7" style={{height: '60px', minHeight: '60px'}}>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          </Col>
        </Row>
      </>
    )
};

export default ControlRequests;