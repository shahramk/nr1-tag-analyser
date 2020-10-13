import React from 'react';
import PropTypes from 'prop-types';

import { Button, navigation } from 'nr1';
import { Grid, Form, Input, Checkbox, Icon, Label, Dropdown } from 'semantic-ui-react';

const entityTypes = [
    { key: 'a', text: 'Application', value: 'APM' },
    { key: 'b', text: 'Browser', value: 'BROWSER' },
    { key: 'i', text: 'Infrastructure', value: 'INFRA' },
    { key: 'm', text: 'Mobile', value: 'MOBILE' },
    { key: 's', text: 'Synthetics', value: 'SYNTH' },
  ];
  
export default class Test extends React.Component {
    // static propTypes = {
    //     accounts: PropTypes.array.isRequired,
    //     handleClick: PropTypes.func.isRequired,
    //     handleRadio: PropTypes.func.isRequired,
    //     handleDropdownChange: PropTypes.func.isRequired,
    // };

    state = {
        value: null,
        templateScope: 'global',
        templateList: null, // templates,
        selectedEntities: [],

    
    };

    submitTemplateChange = () => {
        //
    }

    render() {
        const { value, selectedEntities, templateScope, templateList } = this.state;

        return (
            <>
            <Grid>
                <Grid.Row>
                <Grid.Column width={16}>
                    <Form>
                        <Form.Group widths='equal'>
                        <Form.Field label='template name' control='input' />
                        <br/>
                        <Form.Field label='An HTML <select>' control='select'>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                        </Form.Field>
                        </Form.Group>
                        <Form.Group grouped>
                        <label>HTML radios</label>
                        <Form.Field
                            label='This one'
                            control='input'
                            type='radio'
                            name='htmlRadios'
                        />
                        <Form.Field
                            label='That one'
                            control='input'
                            type='radio'
                            name='htmlRadios'
                        />
                        <Dropdown 
                                className="menu__bar__semantic__dropdown"
                                style={{ minWidth: '20rem' }}
                                placeholder="Entity types..."
                                options={entityTypes}
                                // simple
                                multiple
                                search
                                selection
                                scrolling
                                value={selectedEntities}
                                onChange={(event, data) => { console.log(event, data, "entities"); }}
                            />
                        </Form.Group>
                        <Form.Group grouped>
                        <label>HTML checkboxes</label>
                        <Form.Field label='This one' control='input' type='checkbox' />
                        <Form.Field label='That one' control='input' type='checkbox' />
                        </Form.Group>
                        <Form.Field label='An HTML <textarea>' control='textarea' rows='3' />
                        <Form.Field label='An HTML <button>' control='button'>
                        HTML Button
                        </Form.Field>
                    </Form>
                </Grid.Column>
                </Grid.Row>
            </Grid>
            </>
        );
    };
}
