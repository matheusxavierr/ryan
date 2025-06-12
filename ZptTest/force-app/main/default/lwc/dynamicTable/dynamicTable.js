import { LightningElement, track } from 'lwc';
import getObjectsAndFields from '@salesforce/apex/dynamicTableController.getObjectsAndFields';
import getRecords from '@salesforce/apex/dynamicTableController.getRecords';

export default class DynamicTable extends LightningElement {
    @track objectOptions = [];
    @track fieldsOptions = [];
    @track selectedObject = '';
    @track selectedFields = [];
    @track records = [];
    @track columns = [];

    connectedCallback() {
        getObjectsAndFields()
            .then(data => {
                this.objectOptions = Object.keys(data).map(obj => ({
                    label: obj,
                    value: obj
                }));
                this.allFieldsMap = data;
            });
    }

    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
        const fields = this.allFieldsMap[this.selectedObject];
        this.fieldsOptions = fields.map(f => ({
            label: f.label,
            value: f.apiName
        }));
    }

    handleFieldChange(event) {
        this.selectedFields = event.detail.value;
    }

    handleSearch() {
        if (!this.selectedObject || this.selectedFields.length === 0) return;

        getRecords({ objectName: this.selectedObject, fields: this.selectedFields })
            .then(data => {
                this.records = data;
                this.columns = this.selectedFields.map(f => ({
                    label: this.fieldsOptions.find(x => x.value === f)?.label || f,
                    fieldName: f,
                    type: 'text'
                }));
            });
    }
}
