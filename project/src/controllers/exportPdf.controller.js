const { text } = require('express');
const generatePdf = require('../helpers/pdfGenerator');
const Projects = require('../models/Project');
const Task = require('../models/Task');
class ExportPDF {

    //export project with tasks to pdf(manager only)

    exportProject = async (req, res) => {
        try {
            const projectId = req.params.projectId;
            const project = await Projects.findById(projectId).populate({ path: 'manager', select: ['name', 'email'] });
            if (!project) {
                return res.status(404).json({ message: "Project not fount" })
            }
            const tasks = await Task.find({ projectId: project._id }).populate({ path: 'assignedTo', select: ['name'] });
            const today = new Date().toLocaleDateString('EG');
            const docDefinition = {
                content: [
                    {
                        text: `Task Report for Project:${project.title}`,
                        style: 'header',
                        alignment: 'center'
                    },
                    [{
                        text: `Date:${today}`,
                        alignment: 'left'
                    }, {
                        text: `Manager:${project.manager?.name}`,
                        alignment: 'right'

                    }, {
                        text: `Email-Manager:${project.manager?.email}`,
                        alignment: 'right',


                    }],
                    {
                        text: `Description : ${project.description}`,
                        style: 'subheader'
                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', '*', '*', '*', '*', '*'],
                            body: [
                                [
                                    { text: 'Title', style: 'tableHeader' },
                                    { text: 'Description', style: 'tableHeader' },
                                    { text: 'Assigned To', style: 'tableHeader' },
                                    { text: 'Status', style: 'tableHeader' },
                                    { text: 'Priority', style: 'tableHeader' },
                                    { text: 'Due Date', style: 'tableHeader' }
                                ],
                                ...tasks.map(task => [
                                    task.title,
                                    task.description,
                                    task.assignedTo?.name,
                                    task.status,
                                    task.priority,
                                    new Date(task.dueDate).toLocaleDateString()
                                ])
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    }
                ],
                styles: {
                    header: {
                        fontSize: 22,
                        color: 'orange',
                        alignment: 'center',
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 12,
                        margin: [0, 0, 0, 10]
                    },
                    small: {
                        fontSize: 10,
                        italics: true,
                        margin: [0, 0, 0, 10]
                    },
                    tableHeader: {
                        // bold: true,
                        fontSize: 12,
                        color: 'black'
                    }
                },
                defaultStyle: {},
                // font: 'Roboto'

                footer: function (currentPage, pageCount) {

                    return {
                        columns: [
                            {
                                text: `page ${currentPage} of ${pageCount}`,
                                alignment: 'center',
                                color: 'orange'
                            },
                        ],
                        margin: [0, 10, 0, 0],
                        fontSize: 9,
                        pageSize:'A4',
                        pageMargins:[40,60,40,60]
                    }

                }
            }

            const pdfDoc = generatePdf(docDefinition);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${project.title}.pdf"`);
            pdfDoc.pipe(res);
            pdfDoc.end();

        } catch (error) {
            console.error('Error exporting project tasks PDF:', error);
            res.status(500).json({ error: 'Failed to generate report' });
        }


    }
    //export projects Report to pdf(manager only)
    exportAllProject = async (req, res) => {
        try {
            const project = await Projects.findOne({manager:req.user.id}).populate({ path: 'manager', select: ['name', 'email'] });;
            const projects = await Projects.find().populate({ path: 'manager', select: ['name', 'email'] });
            const today = new Date().toLocaleDateString('EG');
            const docDefinition = {
                content: [
                    { text: 'Projects Report', style: 'header' },
                     [{
                        text: `Date:${today}`,
                        alignment: 'left'
                    }, {
                        text: `Manager:${project.manager?.name}`,
                        alignment: 'right'

                    }, {
                        text: `Email-Manager:${project.manager?.email}`,
                        alignment: 'right',
                    }],
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', '*', '*', '*', '*'],
                            body: [
                                [
                                    { text: 'Title Project', style: 'tableHeader' },
                                    { text: 'Start Date', style: 'tableHeader' },
                                    { text: 'End Date', style: 'tableHeader' },
                                    { text: 'Created By', style: 'tableHeader' },
                                    { text: 'status', style: 'tableHeader' },
                                ],
                                ...projects.map(project => [
                                    project.title,
                                    new Date(project.startDate).toLocaleDateString(),
                                    new Date(project.endDate).toLocaleDateString(),
                                    project.manager?.name || 'N/A',
                                    project.status,
                                ])
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    }
                ],
                styles: {
                    header: {
                        fontSize: 22,
                        color: 'orange',
                        alignment: 'center',
                        margin: [0, 0, 0, 10]
                    },
                    tableHeader: {
                        fontSize: 12,
                        color: 'black'
                    }
                },
                defaultStyle: {
                    // font: 'Roboto'
                },
                footer: function (currentPage, pageCount) {

                    return {
                        columns: [
                            {
                                text: `page ${currentPage} of ${pageCount}`,
                                alignment: 'center',
                                color: 'black'
                            },
                        ],
                        margin: [0, 10, 0, 0],
                        fontSize: 9,
                        pageSize:'A4',
                        pageMargins:[40,60,40,60]
                    }
                }
            };

            const pdfDoc = generatePdf(docDefinition);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="projects_report.pdf"');
            pdfDoc.pipe(res);
            pdfDoc.end();
        } catch (error) {
            console.error('PDF Project Export Error:', error);
            res.status(500).json({ error: 'Failed to export project PDF' });
        }
    }
}
module.exports = new ExportPDF();