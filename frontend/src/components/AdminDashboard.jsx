import React, { useState, useEffect } from 'react';
import {
    Admin, Resource, List, Datagrid, TextField,
    Edit, SimpleForm, TextInput,
    Create, DeleteButton,
    Filter, SelectInput, ReferenceInput,
    useDataProvider, useNotify, useRedirect
} from 'react-admin';
import { API_URL } from '../services/api'; // Adjust path
import axios from 'axios';
import authProvider from '../services/authProvider'; // Adjust path




const apiClient = axios.create({
    baseURL: API_URL,
});

const dataProvider = {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;[[1](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AZnLMfx8f4sKckbyQQsByY8ifeir4oitueVEjXmcH9O3Yc7StxRpu2akhfL_5DfZjSjLCF4A5ntsPgI0h56_BXop9kHiq47K0XpygGqDosqGgwuBEdr6LZom9mI2zfUQ2lf2QaISQPy70aquAuydtMS8H8fIAuPJQaqRENUKDlUphOJXUiD5O9Q=)]

        const query = {
            _start: (page - 1) * perPage,
            _end: page * perPage,
            _sort: field,
            _order: order,
        };
      try {

          const response = await apiClient.get(`/${resource}?${new URLSearchParams(query)}`);


          return {
              data: response.data,
              total: parseInt(response.headers.get('x-total-count'), 10), // Get total from header
          };


      } catch(error) {
         console.error("Error fetching data:", error);
         throw new Error("Error fetching data. Please try again later"); // Throw error to be handled by react-admin

      }

    },




    getOne: async (resource, params) => {

      try {
          const response = await apiClient.get(`/${resource}/${params.id}`);
          return { data: response.data };
       } catch (error) {
            console.error("Error fetching one record:", error);
            throw new Error("Error fetching record. Please try again later.");

       }

    },


    getMany: async (resource, params) => {
        const query = {
             id_in: params.ids

        };


      try {

          const response = await apiClient.get(`/${resource}?${new URLSearchParams(query)}`);

          return { data: response.data };

      } catch(error) {

          console.error("Error fetching multiple records:", error);
          throw new Error("Error fetching records. Please try again later.");

      }
    },




    getManyReference:  async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            ...params.filter,
            _start: (page - 1) * perPage,
            _end: page * perPage,
            _sort: field,
            _order: order,

        };


      try {

          const response = await apiClient.get(`/${resource}?${new URLSearchParams(query)}`);

          return {
              data: response.data,
              total: parseInt(response.headers.get('x-total-count'), 10),
          };



      } catch(error) {

            console.error("Error fetching records by reference", error);
            throw new Error("Error fetching data for related resource. Please try again later.");
      }


    },



    update: async (resource, params) => {

        try {
            const response = await apiClient.put(`/${resource}/${params.id}`, params.data);
            return { data: response.data };

        } catch(error) {
            console.error("Error updating record:", error);
            throw new Error("Could not update record.");

        }



    },






    updateMany: async (resource, params) => {
        try {
             const responses = await Promise.all(
                 params.ids.map(async (id) => {
                      return apiClient.put(`/${resource}/${id}`, params.data);
                 })
             );

            return { data: responses.map((response) => response.data.id ) };  // Return updated ids

        } catch(error) {
            console.error("Error updating multiple records:", error);
            throw new Error("Error updating records.");

        }



    },




    create: async (resource, params) => {
       try {
            const response = await apiClient.post(`/${resource}`, params.data);
            return { data: response.data }; // Return the created record
       } catch(error) {
            console.error("Error creating record", error);
            throw new Error("Error creating record. Please try again later");

       }
    },



    delete: async (resource, params) => {
       try {
          await apiClient.delete(`/${resource}/${params.id}`);
          return { data: { id: params.id } }; // Return id of deleted record

       } catch(error) {
            console.error("Error deleting record:", error);
            throw new Error("Could not delete record");

       }




    },



    deleteMany: async (resource, params) => {
       try {
            await Promise.all(params.ids.map((id) => apiClient.delete(`/${resource}/${id}`)));
            return { data: params.ids }; // Return deleted IDs
       } catch(error) {
            console.error("Error deleting multiple records:", error);
            throw new Error("Could not delete records.");
       }
    },





};


const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>

    </Filter>
);







function AdminDashboard() {

    const [apiKeys, setApiKeys] = useState({});  // Store API keys
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const redirect = useRedirect();

    useEffect(() => {
        const fetchApiKeys = async () => {
            try {
                const response = await apiClient.get('/apikeys'); // Replace with your API endpoint
                setApiKeys(response.data);
            } catch (error) {
                console.error('Error fetching API keys:', error);
                notify('Error fetching API keys', { type: 'error' });
            }
        };

        fetchApiKeys();
    }, [dataProvider, notify]); // Include dataProvider and notify as dependencies



    const handleSaveApiKey = async (key, value) => {  //Save an API Key

        try {
            await apiClient.post('/apikeys', { key, value }); //Endpoint to store keys
            setApiKeys({ ...apiKeys, [key]: value }); //Update local state
            notify('API key saved successfully', { type: 'success' });
        } catch (error) {
            console.error('Error saving API Key:', error);
            notify('Error saving API key', { type: 'error' });
        }


    };

    const handleDeleteApiKey = async (key) => {
        try {
            await apiClient.delete(`/apikeys/${key}`); // Send DELETE request
            const updatedKeys = { ...apiKeys };
            delete updatedKeys[key];
            setApiKeys(updatedKeys);
            notify('API Key deleted!', {type: 'success'});

        } catch (error) {
            console.error("Error Deleting API Key:", error);
            notify('Error deleting API key', { type: 'error' });
        }
    }







    // ... rest of your admin component logic (add, edit, delete users/settings)

     // ... (user management, settings, etc.)
        return (
            <Admin dataProvider={dataProvider} authProvider={authProvider}>
                <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
                <Resource name="settings" list={SettingsList} edit={SettingsEdit} />
                {/* ... other resources */}

            </Admin>
        );


}



export default AdminDashboard;
