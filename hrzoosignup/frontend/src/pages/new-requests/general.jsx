import React, { useState, useContext } from 'react'
import RequestHorizontalRuler from '../../components/RequestHorizontalRuler';
import { CustomReactSelect } from '../../components/CustomReactSelect';
import {
  Col,
  Card,
  CardBody,
  ButtonGroup,
  CardFooter,
  CardHeader,
  Row,
  Button,
  Label,
  Form,
  FormGroup,
  InputGroup,
  Input,
  InputGroupText
} from 'reactstrap';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { SharedData } from '../root';
import DatePicker from 'react-date-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import '../../styles/datepicker.css';


const GeneralRequest = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      requestName: '',
      requestExplain: '',
      startDate: '',
      endDate: '',
      requestResourceType: '',
      nSlotsCPU: '', nSlotsGPU: '', nRAM: '', nTempGB: '', nDiskGB: '',
      scientificDomain: [
        {'name': '', 'percent': '', 'scientificfields': []},
      ]
    }
  });
  const onSubmit = data => {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
        <RequestHorizontalRuler />
        <GeneralFields control={control} errors={errors} handleSubmit={handleSubmit} />
        <ResourceFields control={control} errors={errors} />
        <RequestHorizontalRuler />
        <Row className="mt-2 mb-2 text-center">
          <Col>
            <Button size="lg" color="success" id="submit-button" type="submit">Podnesi zahtjev</Button>
          </Col>
        </Row>
      </Form>
    </>
  )
};


const GeneralFields = ({control, errors, handleSubmit}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "scientificDomain",
  });

  function onSubmit() {
  }

  return (
    <>
      <Row>
        <Col>
          <h4 className="ms-4 mb-3 mt-4">Opći dio</h4><br/>
        </Col>
      </Row>
      <Row>
        <Col md={{size: 10, offset: 1}}>
          <Label
            htmlFor="requestName"
            aria-label="requestName">
            Naziv:
          </Label>
          <Controller
            name="requestName"
            control={control}
            rules={{required: true}}
            render={ ({field}) =>
              <textarea
                id="requestName"
                {...field}
                aria-label="requestName"
                type="text"
                className="form-control"
                rows="1"
                required={true}
              />
            }
          />
        </Col>
        <Col>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={{size: 10, offset: 1}}>
          <Label
            htmlFor="requestExplain"
            aria-label="requestExplain">
            Obrazloženje:
          </Label>
          <Controller
            name="requestExplain"
            control={control}
            rules={{required: true}}
            render={ ({field}) =>
              <textarea
                id="requestExplain"
                {...field}
                aria-label="requestExplain"
                type="text"
                className="form-control"
                rows="3"
                required={true}
              />
            }
          />
        </Col>
        <Col>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={{size: 5, offset: 1}}>
          <Label
            htmlFor="requestName"
            aria-label="requestName">
            Period korištenja:
          </Label>
        </Col>
        <Col md={{size: 10, offset: 1}} style={{whiteSpace: 'nowrap'}}>
          <Controller
            name="startDate"
            control={control}
            rules={{required: true}}
            render={ ({field}) =>
              <DatePicker
                {...field}
                locale="hr-HR"
                className="mt-2 me-3"
              />
            }
          />
          {'\u2212'}
          <Controller
            name="endDate"
            control={control}
            rules={{required: true}}
            render={ ({field}) =>
              <DatePicker
                {...field}
                locale="hr-HR"
                className="ms-3"
              />
            }
          />
        </Col>
      </Row>
      <Row className="mt-3 d-flex align-items-center g-0">
        <Col md={{offset: 1}}>
          <Label
            htmlFor="scientificDomain"
            aria-label="scientificDomain"
            className="mt-2 text-right form-label">
            Znanstveno područje:
          </Label>
          {
            fields.map((item, index) => (
              <Row key={item.id}>
                <Col md={{size: 5}} key={item.id}>
                  <Card key={item.id}>
                    <CardHeader className="d-inline-flex align-items-center">
                      <Controller
                        name={`scientificDomain.${index}.name`}
                        control={control}
                        rules={{required: true}}
                        render={ ({field}) =>
                          <CustomReactSelect
                            {...field}
                            id="scientificDomain"
                            aria-label="scientificDomain"
                            placeholder="Odaberi"
                            controlWidth="300px"
                            options={[{'label': 'foo', 'value': 'bar'}]}
                          />
                        }
                      />
                      <InputGroup>
                        <Controller
                          name={`scientificDomain.${index}.percent`}
                          aria-label="scientificDomainPercent"
                          control={control}
                          rules={{required: true}}
                          render={ ({field}) =>
                            <Input
                              {...field}
                              className="ms-1 form-control text-center"
                              placeholder="Udio"
                              type="number"
                            />
                          }
                        />
                        <InputGroupText>
                          %
                        </InputGroupText>
                      </InputGroup>
                      <Button
                        size="sm"
                        color="danger"
                        type="button"
                        className="ms-2"
                        onClick={() => remove(index)}
                      >
                        <FontAwesomeIcon icon={faTimes}/>
                      </Button>
                    </CardHeader>
                    <CardBody>
                      Foobar
                    </CardBody>
                  </Card>
                </Col>
                {
                  index === fields.length - 1 &&
                    <Col sm={{size: 3, offset: 1}}>
                      <Button outline color="secondary" onClick={() =>
                        append({'name': '', 'percent': '', 'scientificfields': []})}>
                        Dodaj novo znanstveno područje
                      </Button>
                    </Col>
                }
              </Row>
            ))
          }
        </Col>
      </Row>
    </>
  )
}


const ResourceFields = ({control, errors}) => {
  const { ResourceTypesToSelect } = useContext(SharedData);

  return (
    <>
      <Row className="mt-5">
        <Col>
          <h4 className="ms-4 mb-3 mt-4">Resursi</h4><br/>
        </Col>
      </Row>
      <Row>
        <Col md={{size: 2, offset: 1}}>
          <Label
            htmlFor="nSlotsCPU"
            aria-label="nSlotsCPU"
            className="mr-2 form-label text-center">
            Prosječan broj procesorskih jezgri po poslu:
          </Label>
        </Col>
        <Col md={{size: 2}}>
          <Label
            htmlFor="nSlotsGPU"
            aria-label="nSlotsGPU"
            className="mr-2 form-label text-center">
            Prosječan broj grafičkih procesora po poslu:
          </Label>
        </Col>
        <Col md={{size: 2}}>
          <Label
            htmlFor="nRAM"
            aria-label="nRAM"
            className="mr-2 form-label text-center">
            Prosječna količina radne memorije po poslu (GB):
          </Label>
        </Col>
        <Col md={{size: 2}}>
          <Label
            htmlFor="nTempGB"
            aria-label="nTempGB"
            className="mr-2 form-label text-center">
            Prosječna količina privremenog prostora po poslu (GB):
          </Label>
        </Col>
        <Col md={{size: 2}}>
          <Label
            htmlFor="nDiskGB"
            aria-label="nDiskGB"
            className="mr-2 form-label text-center">
            Ukupna količina spremišnog prostora po poslu (GB):
          </Label>
        </Col>
        <div className="w-100"></div>
        <Col md={{size: 2, offset: 1}}>
          <InputGroup>
            <Controller
              name="nSlotsCPU"
              aria-label="nSlotsCPU"
              control={control}
              rules={{required: true}}
              render={ ({field}) =>
                <Input
                  {...field}
                  className="form-control text-center"
                  type="number"
                />
              }
            />
            <InputGroupText>
              CPU
            </InputGroupText>
          </InputGroup>
        </Col>
        <Col md={{size: 2}}>
          <InputGroup>
            <Controller
              name="nSlotsGPU"
              aria-label="nSlotsGPU"
              control={control}
              rules={{required: true}}
              render={ ({field}) =>
                <Input
                  {...field}
                  className="form-control text-center"
                  type="number"
                />
              }
            />
            <InputGroupText>
              GPU
            </InputGroupText>
          </InputGroup>
        </Col>
        <Col md={{size: 2}}>
          <InputGroup>
            <Controller
              name="nRAM"
              aria-label="nRAM"
              control={control}
              rules={{required: true}}
              render={ ({field}) =>
                <Input
                  {...field}
                  className="form-control text-center"
                  type="number"
                />
              }
            />
            <InputGroupText>
              RAM
            </InputGroupText>
          </InputGroup>
        </Col>
        <Col md={{size: 2}}>
          <InputGroup>
            <Controller
              name="nTempGB"
              aria-label="nTempGB"
              control={control}
              rules={{required: true}}
              render={ ({field}) =>
                <Input
                  {...field}
                  className="form-control text-center"
                  type="number"
                />
              }
            />
            <InputGroupText>
              Temp
            </InputGroupText>
          </InputGroup>
        </Col>
        <Col md={{size: 2}}>
          <InputGroup>
            <Controller
              name="nDiskGB"
              aria-label="nDiskGB"
              control={control}
              rules={{required: true}}
              render={ ({field}) =>
                <Input
                  {...field}
                  className="form-control text-center"
                  type="number"
                />
              }
            />
            <InputGroupText>
              Disk
            </InputGroupText>
          </InputGroup>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={{size: 3, offset: 1}}>
          <Label
            htmlFor="requestResourceType"
            aria-label="requestResourceType"
            className="mr-2 text-right form-label">
            Tip resursa:
          </Label>
          <Controller
            name="requestResourceType"
            control={control}
            rules={{required: true}}
            render={ ({field}) =>
              <CustomReactSelect
                {...field}
                closeMenuOnSelect={false}
                id="requestResourceType"
                aria-label="requestResourceType"
                placeholder="Odaberi"
                isMulti
                controlWidth="400px"
                resourceTypeMultiValue={true}
                options={ResourceTypesToSelect}
              />
            }
          />
        </Col>
      </Row>
    </>
  )
}



export default GeneralRequest;
