const supabase = require('../config/supabase')

class Ticket {
  static async create(ticketData) {
    console.log("Creating ticket with data:", ticketData);
    
    // Prepare the data - ensure all fields are included
    const data = {
      title: ticketData.title,
      description: ticketData.description || '',
      likelihood: ticketData.likelihood,
      severity: ticketData.severity,
      date: ticketData.date,
      status: ticketData.status,
      project_id: ticketData.project_id,
      assignee_id: ticketData.assignee_id || null
    };

    console.log("Prepared data for insert:", data);

    try {
      const { data: result, error } = await supabase
        .from('tickets')
        .insert(data)
        .select(`
          *,
          assignee:users(id, name, email)
        `)
        .single();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Created ticket result:", result);
      return result;
    } catch (error) {
      console.error("Error in create ticket:", error);
      throw error;
    }
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        assignee:users(id, name, email),
        project:projects(id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error finding ticket:", error);
      throw error;
    }
    return data;
  }

  static async findByProject(projectId) {
    console.log("Fetching tickets for project:", projectId);
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        assignee:users(id, name, email)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
    
    console.log("Found tickets:", data);
    return data;
  }

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        assignee:users(id, name, email)
      `)
      .single();
    
    if (error) {
      console.error("Error updating status:", error);
      throw error;
    }
    return data;
  }

  static async updateAssignee(id, assignee_id) {
    const { data, error } = await supabase
      .from('tickets')
      .update({ assignee_id })
      .eq('id', id)
      .select(`
        *,
        assignee:users(id, name, email)
      `)
      .single();
    
    if (error) {
      console.error("Error updating assignee:", error);
      throw error;
    }
    return data;
  }
}

module.exports = Ticket