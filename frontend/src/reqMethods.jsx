// GET - Retrieve data
async function GET(destination, data, customHeaders = {}) {
    try {
      const response = await fetch(`${destination}/${data}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      throw error;
    }
};

// POST - Create new resource
async function POST(destination, data, customHeaders={}){
    try {
      const response = await fetch(`${destination}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      throw error;
    }
};

// PUT - Update entire resource
async function PUT(destination, data, customHeaders = {}) {
    try {
      const response = await fetch(`${destination}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      throw error;
    }
}

// PATCH - Partial update
async function PATCH(destination, data, customHeaders = {}) {
    try {
      const response = await fetch(`${destination}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      throw error;
    }
}

// DELETE - Remove resource
async function DELETE(destination, customHeaders = {}) {
    try {
      const response = await fetch(`${destination}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Some DELETE requests return data, others return empty
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 0) {
        const result = await response.json();
        return result;
      }
      
      return { success: true, message: 'Deleted successfully' };
      
    } catch (error) {
      throw error;
    }
}
export default {GET,POST,PUT,PATCH,DELETE};