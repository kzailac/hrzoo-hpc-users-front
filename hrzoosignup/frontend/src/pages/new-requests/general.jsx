import React, { useState } from 'react'
import RequestHorizontalRuler from '../../components/RequestHorizontalRuler';
import { CustomReactSelect } from '../../components/CustomReactSelect';
import { Col, Row, Button, Label, Form  } from 'reactstrap';
import { useForm, Controller } from "react-hook-form";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import '../../styles/datepicker.css';

const GeneralRequest = () => {
  const { control, setValue, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      requestName: '',
      requestExplain: '',
      startDate: '',
      endDate: '',
      requestResourceType: ''
    }
  });
  const onSubmit = data => {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
        <RequestHorizontalRuler />
        <Row>
          <Col>
            <h4 className="ms-4 mb-3 mt-4">Opći dio</h4><br/>
          </Col>
        </Row>
        <Row>
          <Col md={{size: 10, offset: 1}}>
            <Label
              htmlFor="requestName"
              aria-label="requestName"
              className="mr-2 text-right form-label">
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
              aria-label="requestExplain"
              className="mr-2 text-right form-label">
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
              aria-label="requestName"
              className="mr-2 text-right form-label">
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
        <Row className="mt-5">
          <Col>
            <h4 className="ms-4 mb-3 mt-4">Resursi</h4><br/>
          </Col>
        </Row>
        <Row>
          <Col md={{size: 10, offset: 1}}>
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
                  id="requestResourceType"
                  aria-label="requestResourceType"
                  placeholder="Odaberi"
                  controlWidth="300px"
                />
              }
            />
          </Col>
          <Col>
          </Col>
        </Row>
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

export default GeneralRequest;
