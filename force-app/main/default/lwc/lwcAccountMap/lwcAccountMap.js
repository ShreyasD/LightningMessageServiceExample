import { LightningElement, track } from 'lwc';
import {subscribe,unsubscribe,createMessageContext,releaseMessageContext} from 'lightning/messageService';
import ACCOUNTLOCATORMC from '@salesforce/messageChannel/AccountLocatorMsgChannel__c';

export default class LwcAccountMap extends LightningElement {
    context = createMessageContext();
    subscription = null;

    @track mapMarkers = [];

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
        let markers = [];
        for ( let i = 0; i < message.accounts.length; i++ ) {
            let account = message.accounts[i];
            let marker = {
                'location': {
                    'Street': account.BillingStreet,
                    'City': account.BillingCity,
                    'PostalCode': account.BillingPostalCode
                },
                'title': account.Name,
                'description': (
                    'Phone: ' + account.Phone +
                    '<br/>' +
                    'Website: ' + account.Website
                ),
                'icon': 'standard:location'
            };
            markers.push( marker );
        }
        this.mapMarkers = markers;
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
        releaseMessageContext(this.context);
    }
}