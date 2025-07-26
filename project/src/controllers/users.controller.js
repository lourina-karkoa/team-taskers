const users = require("../models/Users");
const generatePdf = require('../helpers/pdfGenerator');
const Projects = require('../models/Projects'); 
const Task = require('../models/Task');

/*

// API does fetch for full activity log
const ActivityLogs = require('../models/ActivityLogs');

 getAllActivityLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const logges = await ActivityLogs.paginate({select:['user','ActivityType','description','entityRef.entityId'],page:page})

        return res.status(201).json({ message: "Done",Data: logges })
    } catch (error) {
        throw new Error(error.message);
    }

};

// API deletes full activity history
 deleteAllActivityLogs = async (req, res) => {
    try {
        
        const logges = await ActivityLogs.deleteMany();

        return res.status(201).json({ message: "Deleted successfully" })
    } catch (error) {
        throw new Error(error.message);
    }

};
// API fetch the activities he has added
 getMyActivity = async (req, res) => {
    try {
        const id = req.id;
        const page = parseInt(req.query.page);
        const logges = await ActivityLogs.paginate({filter:{user:id},select:['user','ActivityType','description','entityRef.entityId'],page:page})
        return res.status(201).json({ message: "fetched MyActivit logs successfully",Data:logges })
    } catch (error) {
        throw new Error(error.message);
    }

};
 

// API fetch specific activity details
 getActivityById = async (req, res) => {
    try {
        const id = req.parmas.id
        const logges = await ActivityLogs.findById(id).populate({path:'user',select:'name'})
        return res.status(201).json({ message: "fetched MyActivit logs successfully",Data:logges })
    } catch (error) {
        throw new Error(error.message);
    }

};
*/
// exportProject = async (req,res)=>{
//  const {projectId} =req.params;
//  try{
//  const project = await Projects.findById(projectId);
//  if(!project){
//     return res.status(404).json({message: "Project not fount"})
//  }
//  const tasks = await Task.find();
//  const docDefinition ={
//     content:[
//         {
//         text:`Task Report for Project:${project.title}`,
//         style:'header'},
//         {
//         text:`Description : ${project.description}`,
//         style:'subheader' 
//         },
//         {
//         {
//           table: {
//             headerRows: 1,
//             widths: ['*', '*', '*', '*', '*', '*'],
//             body: [
//               [
//                 { text: 'Title', style: 'tableHeader' },
//                 { text: 'Description', style: 'tableHeader' },
//                 { text: 'Assigned To', style: 'tableHeader' },
//                 { text: 'Status', style: 'tableHeader' },
//                 { text: 'Priority', style: 'tableHeader' },
//                 { text: 'Due Date', style: 'tableHeader' }
//               ],
//               ...tasks.map(task => [
//                 task.title,
//                 task.description,
//                 task.assignedTo,
//                 task.status,
//                 task.priority,
//                 new Date(task.dueDate).toLocaleDateString()
//               ])
//             ]
//           },
//           layout: 'lightHorizontalLines'
//         }
//       ],
//       styles: {
//         header: {
//           fontSize: 22,
//           bold: true,
//           alignment: 'center',
//           margin: [0, 0, 0, 10]
//         },
//         subheader: {
//           fontSize: 12,
//           margin: [0, 0, 0, 10]
//         },
//         small: {
//           fontSize: 10,
//           italics: true,
//           margin: [0, 0, 0, 10]
//         },
//         tableHeader: {
//           bold: true,
//           fontSize: 12,
//           color: 'black'
//         }
//       },
//       defaultStyle: {
//         font: 'Roboto'
//       }
//     };

//     const pdfDoc = generatePdf(docDefinition);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${project.title}_tasks_page${page}.pdf"`);
//     pdfDoc.pipe(res);
//     pdfDoc.end();

//   } catch (error) {
//     console.error('Error exporting project tasks PDF:', error);
//     res.status(500).json({ error: 'Failed to generate report' });
//   }


// }






// exportAllProject= async (req, res) => {
//   try {
//     const projects = await Projects.find();

//     const docDefinition = {
//       content: [
//         { text: 'Project Report', style: 'header' },
//         {
//           table: {
//             headerRows: 1,
//             widths: ['*', '*', '*', '*', '*'],
//             body: [
//               [
//                 { text: 'Title', style: 'tableHeader' },
//                 { text: 'Description', style: 'tableHeader' },
//                 { text: 'Start Date', style: 'tableHeader' },
//                 { text: 'End Date', style: 'tableHeader' },
//                 { text: 'Created By', style: 'tableHeader' }
//               ],
//               ...projects.map(project => [
//                 project.title,
//                 project.description,
//                 new Date(project.startDate).toLocaleDateString(),
//                 new Date(project.endDate).toLocaleDateString(),
//                 project.createdBy || 'N/A'
//               ])
//             ]
//           },
//           layout: 'lightHorizontalLines'
//         }
//       ],
//       styles: {
//         header: {
//           fontSize: 22,
//           bold: true,
//           alignment: 'center',
//           margin: [0, 0, 0, 10]
//         },
//         tableHeader: {
//           bold: true,
//           fontSize: 12,
//           color: 'black'
//         }
//       },
//       defaultStyle: {
//         font: 'Roboto'
//       }
//     };

//     const pdfDoc = generatePdf(docDefinition);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="projects_report.pdf"');
//     pdfDoc.pipe(res);
//     pdfDoc.end();
//   } catch (error) {
//     console.error('PDF Project Export Error:', error);
//     res.status(500).json({ error: 'Failed to export project PDF' });
//   }
// }

