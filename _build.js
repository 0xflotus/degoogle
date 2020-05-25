// Build tool for generating README.md
// TODO: Add support for section-specific comments

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const YAML = require('yaml');

// A hacky sort of "class" to contain methods for each section
const BUILD_SECTION = {
    // TODO: Make more of these YAML-based functions
    header: () => readFile('md/_header.md'),
    index: () => readFile('md/_index.md'),
    contributing: () => readFile('md/_contributing.md'),
    browserExtensions: () => readFile('md/_browserExtensions.md'),
    disclaimer: () => readFile('md/_disclaimer.md'),
    webBasedProducts: () => generateCategorySection('Web-based products', readYaml()['web based products']),
    operatingSystems: () => generateCategorySection('Operating systems', readYaml()['operating systems']),
    desktopApps: () => generateCategorySection('Desktop apps', readYaml()['desktop applications']),
    mobileApps: () => generateCategorySection('Mobile apps', readYaml()['mobile applications']),
    hardware: () => generateCategorySection('Hardware', readYaml()['hardware']),
    useful: () => '# Useful links, tools, and advice',
    resources: () => readFile('md/_resources.md'),
    books: () => readFile('md/_books.md'),
    blogs: () => readFile('md/_blogs.md'),
    news: () => readFile('md/_news.md'),
    lighterSide: () => readFile('md/_lighterSide.md'),
    closingRemarks: () => readFile('md/_closingRemarks.md')
}

/**
 * Main method
 */
function __main__() {
    // dgSectionData will be join at the end and represents the full contents of README.md
    let dgSectionData = [];

    // Add all the sections
    dgSectionData.push(BUILD_SECTION.header());
    dgSectionData.push(BUILD_SECTION.index());
    dgSectionData.push(BUILD_SECTION.contributing());
    dgSectionData.push(BUILD_SECTION.browserExtensions());
    dgSectionData.push(BUILD_SECTION.disclaimer());
    dgSectionData.push(BUILD_SECTION.webBasedProducts());
    dgSectionData.push(BUILD_SECTION.operatingSystems());
    dgSectionData.push(BUILD_SECTION.desktopApps());
    dgSectionData.push(BUILD_SECTION.mobileApps());
    dgSectionData.push(BUILD_SECTION.hardware());
    dgSectionData.push(BUILD_SECTION.useful());
    dgSectionData.push(BUILD_SECTION.resources());
    dgSectionData.push(BUILD_SECTION.books());
    dgSectionData.push(BUILD_SECTION.blogs());
    dgSectionData.push(BUILD_SECTION.news());
    dgSectionData.push(BUILD_SECTION.lighterSide());
    dgSectionData.push(BUILD_SECTION.closingRemarks());

    // Write to the README file
    fs.writeFileSync(path.join(__dirname, 'README.md'), dgSectionData.join(os.EOL + os.EOL));

    console.log('Done!')
}

/**
 * Synchronously reads a file using fs-extra and path.join()
 * @param {String} filename The file to read
 */
function readFile(filename) {
    return fs.readFileSync(path.join(__dirname, filename)).toString();
}

/**
 * Reads degoogle.yml
 */
function readYaml() {
    return YAML.parse(fs.readFileSync(path.join(__dirname, 'degoogle.yml')).toString());
}

/**
 * Generates a major section or "category" such as Mobile Apps
 * @param {String} header Title for section
 * @param {Object} data Object of data to populate README.md with
 */
function generateCategorySection(header, data) {
    if (!data) return '';

    // Set the header to HTML <h5>
    let categorySection = '## ' + header + os.EOL + os.EOL;

    // Generate service sections for this category
    Object.keys(data).forEach((key) => categorySection = categorySection.concat(generateServiceSection(data[key]) + os.EOL + os.EOL));

    return categorySection;
}

/**
 * Generates a service (such as Gmail) section to be placed under a category section
 * @param {Array} data
 */
function generateServiceSection(data) {
    // Start the section with an <h4> header and the start of a Markdown table
    let serviceSection = `#### ${data[0].title + os.EOL + os.EOL}| Name | Eyes | Description |${os.EOL}| ---- | ---- | ----------- |${os.EOL}`;
    let notes = os.EOL + '';
    // Iterate over each alternative service and add it to the table
    data.forEach(item => {
        // If the object has length one, it's either title or note
        if (Object.keys(item).length == 1) {
            if (!item.notes) return;
            else item.notes.forEach((note) => notes = notes.concat(`- *${note.trim()}*${os.EOL}`))
        } else {
            // Build the cells for the table
            let name = `[${item.name}](${item.url})`;
            let eyes = item.eyes ? `**${item.eyes}-eyes**` : '';
            let text = item.text.trim();
    
            // Build the row
            let tableItem = `| ${name} | ${eyes} | ${text} |`;
    
            // Add the row to the table
            serviceSection = serviceSection.concat(tableItem + os.EOL)
        }
    });

    return serviceSection + notes;
}

__main__();