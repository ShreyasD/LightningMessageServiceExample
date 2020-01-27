import { LightningElement, track } from 'lwc';
import {subscribe,unsubscribe,createMessageContext,releaseMessageContext} from 'lightning/messageService';
import ACCOUNTLOCATORMC from '@salesforce/messageChannel/AccountLocatorMsgChannel__c';

export default class LwcAccountList extends LightningElement {
    context = createMessageContext();
    subscription = null;

    @track cols;
    @track rows;

    constructor() {
        super();
        if(this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.context,
            ACCOUNTLOCATORMC, (message) => {
                this.onAccountsLoaded(message);
            })
    }

    onAccountsLoaded(message) {
        this.cols = [
            {
                'label': 'Name',
                'fieldName': 'Name',
                'type': 'text'
            },
            {
                'label': 'Phone',
                'fieldName': 'Phone',
                'type': 'phone'
            },
            {
                'label': 'Website',
                'fieldName': 'Website',
                'type': 'url'
            },
            {
                'label': 'Action',
                'type': 'button',
                'typeAttributes': {
                    'label': 'View details',
                    'name': 'view_details'
                }
            }
        ];
        this.rows = message.accounts;
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
        releaseMessageContext(this.context);
    }
}