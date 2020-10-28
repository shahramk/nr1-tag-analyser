import React from 'react';
import PropTypes from 'prop-types';

import { Button, Checkbox, Icon, Radio, RadioGroup, TextField } from 'nr1';

import utils from './utils';

export default class Templates extends React.Component {
  static propTypes = {
    templates: PropTypes.array,
    accounts: PropTypes.array,
    userEmail: PropTypes.string,
    onUpdate: PropTypes.func,
  };

  state = {
    template: null,
    templateName: '',
    tagName: '',
    tagMandatory: true,
  };

  newTemplate = () => {
    const { templates, userEmail, onUpdate } = this.props;

    let newTemplates = utils.deepCopy(templates);
    newTemplates.push({
      name: 'untitled',
      scope: 'global',
      accounts: [],
      tags: [],
      enabled: true,
      createdDate: Date.now(),
      lastUpdatedDate: Date.now(),
      lastUpdatedBy: userEmail || '',
    });

    if (onUpdate) onUpdate('templates', newTemplates);
  };

  saveTemplate = () => {
    const { template, selectedTemplate } = this.state;
    const { templates, userEmail, onUpdate } = this.props;

    const newTemplates = utils.deepCopy(templates);
    const newTemplate = utils.deepCopy(template);
    newTemplate.lastUpdatedDate = Date.now();
    newTemplate.lastUpdatedBy = userEmail || '';
    newTemplates[selectedTemplate] = newTemplate;

    this.setState(
      {
        template: newTemplate,
        templateName: newTemplate.name,
        tagName: '',
        tagMandatory: true,
      },
      () => (onUpdate ? onUpdate('templates', newTemplates) : null)
    );
  };

  selectTemplate = (e, index) => {
    e.preventDefault();
    const { templates } = this.props;

    const template = templates[index];

    this.setState({
      template,
      selectedTemplate: index,
      templateName: template.name,
      tageName: '',
      tagMandatory: true,
    });
  };

  deleteTemplate = (e, index) => {
    e.preventDefault();
    const { templates, onUpdate } = this.props;

    let newTemplates = utils.deepCopy(templates);
    newTemplates.splice(index, 1);

    this.setState(
      {
        template: null,
        selectedTemplate: null,
        templateName: '',
        tagName: '',
        tagMandatory: true,
      },
      () => (onUpdate ? onUpdate('templates', newTemplates) : null)
    );
  };

  updateText = (e, which) => {
    const val = e.target.value;
    this.setState({ [which]: val }, () => {
      if (which === 'templateName') {
        const { template } = this.state;

        const newTemplate = utils.deepCopy(template);
        newTemplate.name = val;
        this.setState({ template: newTemplate });
      }
    });
  };

  scopeChange = (e, scope) => {
    const { template } = this.state;

    const newTemplate = utils.deepCopy(template);
    newTemplate.scope = scope;
    newTemplate.accounts = [];

    this.setState({ template: newTemplate });
  };

  acctChecked = (e, index) => {
    const { template } = this.state;
    const { accounts } = this.props;

    const newTemplate = utils.deepCopy(template);
    const account = accounts[index];

    if (e.target.checked) {
      newTemplate.accounts.push(account.id);
    } else {
      const acctIndex = newTemplate.accounts.findIndex(
        (acct) => acct === account.id
      );
      newTemplate.accounts.splice(acctIndex, 1);
    }

    this.setState({ template: newTemplate });
  };

  newTag = () => {
    const { template, tagName, tagMandatory } = this.state;

    const newTemplate = utils.deepCopy(template);
    newTemplate.tags.push({
      name: tagName,
      mandatory: tagMandatory,
    });

    this.setState({ template: newTemplate, tagName: '', tagMandatory: true });
  };

  updateTag = (e, index, type) => {
    const { template } = this.state;

    const newTemplate = utils.deepCopy(template);
    newTemplate.tags[index][type] =
      type === 'mandatory' ? e.target.checked : e.target.value;

    this.setState({ template: newTemplate });
  };

  deleteTag = (index) => {
    const { template } = this.state;

    const newTemplate = utils.deepCopy(template);
    newTemplate.tags.splice(index, 1);

    this.setState({ template: newTemplate });
  };

  render() {
    const {
      template,
      selectedTemplate,
      templateName,
      tagName,
      tagMandatory,
    } = this.state;
    const { templates, accounts } = this.props;

    const isAcctChecked = (index) =>
      template && template.accounts.find((acct) => acct === accounts[index].id);

    return (
      <div className="templates">
        <div className="listing">
          <div className="list-head">
            <Button
              onClick={this.newTemplate}
              sizeType={Button.SIZE_TYPE.SMALL}
              iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
            >
              Add Template
            </Button>
            {template ? (
              <Button
                onClick={this.saveTemplate}
                sizeType={Button.SIZE_TYPE.SMALL}
                iconType={Button.ICON_TYPE.INTERFACE__SIGN__CHECKMARK}
              >
                Save
              </Button>
            ) : null}
          </div>
          <ul>
            {templates.map((template, t) => (
              <li key={t} className={selectedTemplate === t ? 'current' : ''} onClick={(e) => this.selectTemplate(e, t)}>
                <a
                  href="#"
                  className="u-unstyledLink"
                >
                  {template.name}
                </a>
                <a
                  href="#"
                  className="u-unstyledLink del"
                  onClick={(e) => this.deleteTemplate(e, t)}
                >
                  <Icon type={Icon.TYPE.INTERFACE__SIGN__TIMES} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="template-meta">
          {template ? (
            <>
              <div>
                <TextField 
                  className="template-name"
                  label="Name"
                  placeholder="Template Name"
                  value={templateName}
                  onChange={(e) => this.updateText(e, 'templateName')}
                />
              </div>
              <div>
                <span className="label">Scope</span>
                <RadioGroup value={template.scope} onChange={this.scopeChange}>
                  <Radio
                    style={{ display: 'inline-flex', marginRight: '1em' }}
                    label="Global"
                    value="global"
                  />
                  <Radio
                    style={{ display: 'inline-flex', marginRight: '1em' }}
                    label="Account"
                    value="account"
                  />
                </RadioGroup>
              </div>
              <div>
                {template.scope === 'account' &&
                  accounts.map((account, a) => (
                    <div key={a}>
                      <Checkbox
                        checked={!!isAcctChecked(a)}
                        onChange={(e) => this.acctChecked(e, a)}
                        label={account.text}
                      />
                    </div>
                  ))}
              </div>
            </>
          ) : null}
        </div>
        <div className="template-tags">
          {template ? (
            <>
              <div className="tag-entry">
                <TextField
                  label="Add Tag"
                  placeholder="Tag Name"
                  value={tagName}
                  onChange={(e) => this.updateText(e, 'tagName')}
                />
                <Checkbox
                  checked={tagMandatory}
                  onChange={(e) =>
                    this.setState({ tagMandatory: e.target.checked })
                  }
                  label="Mandatory"
                />
                <Button
                  onClick={this.newTag}
                  sizeType={Button.SIZE_TYPE.SMALL}
                  iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
                >
                  Add Tag
                </Button>
              </div>
              {template.tags.map((tag, t) => (
                <div className="tag-entry" key={t}>
                  <TextField
                    label=""
                    placeholder="Tag Name"
                    value={tag.name}
                    onChange={(e) => this.updateTag(e, t, 'name')}
                  />
                  <Checkbox
                    checked={tag.mandatory}
                    onChange={(e) => this.updateTag(e, t, 'mandatory')}
                    label="Mandatory"
                  />
                  <Button
                    onClick={() => this.deleteTag(t)}
                    sizeType={Button.SIZE_TYPE.SMALL}
                    iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    );
  }
}
