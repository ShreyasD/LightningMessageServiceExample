import { LightningElement, track } from 'lwc';
import searchAccounts from '@salesforce/apex/AccountSearchController.searchAccounts';
import { publish,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import ACCOUNTLOCATORMC from '@salesforce/messageChannel/AccountLocatorMsgChannel__c';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

export default class LwcAccountSearch extends LightningElement {
    @track searchTerm = 'San Francisco';

    //Lightning Message service
    context = createMessageContext();

    connectedCallback() {
        searchAccounts({searchTerm: this.searchTerm})
            .then(result => {
                const message = {
                    accounts: result
                };
                publish(this.context, ACCOUNTLOCATORMC, message);
            }).catch(error => {
                console.log('error: ' + JSON.stringify(error));
            });
    }

    onSearchTermChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchTerm = searchKey;
            searchAccounts({searchTerm: this.searchTerm})
            .then(result => {
                const message = {
                    accounts: result
                };
                publish(this.context, ACCOUNTLOCATORMC, message);
            }).catch(error => {
                console.log('error: ' + JSON.stringify(error));
            });
        }, DELAY);
    }

    disconnectedCallback() {
        releaseMessageContext(this.context);
    }
}