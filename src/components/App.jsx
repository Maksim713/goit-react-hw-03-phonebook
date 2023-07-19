import { Component } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix';
import Section from './Section';
import ContactForm from './ContactForm';
import ContactsList from './ContactsList';
import Filter from './Filter';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  pullFormData = data => {
    const nameExists = this.state.contacts.some(
      it => it.name.toLowerCase() === data.name.toLowerCase()
    );
    if (nameExists) {
      Notify.warning(`${data.name} is already in contacts.`);
      return;
    }

    this.setState(prevState => ({
      contacts: [...prevState.contacts, { ...data, id: nanoid() }],
    }));
  };

  handleInputChange = e => {
    this.setState({ filter: e.target.value });
  };

  deleteItem = deletedId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(({ id }) => id !== deletedId),
    }));
  };

  componentDidMount() {
    const stringifiedContacts = localStorage.getItem('phonebookContacts');
    const contacts = JSON.parse(stringifiedContacts) ?? [];

    this.setState({ contacts });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem(
        'phonebookContacts',
        JSON.stringify(this.state.contacts)
      );
    }
  }

  render() {
    const { contacts, filter } = this.state;
    const filteredContacts = contacts.filter(it =>
      it.name.toLowerCase().includes(filter.toLowerCase())
    );
    return (
      <div>
        <Section title="Phonebook">
          <ContactForm onSubmit={this.pullFormData} />
        </Section>
        <Section title="Contacts">
          <Filter filter={filter} onSearchInput={this.handleInputChange} />
          <ContactsList
            contacts={filteredContacts}
            onClickDelete={this.deleteItem}
          />
        </Section>
      </div>
    );
  }
}

export default App;
