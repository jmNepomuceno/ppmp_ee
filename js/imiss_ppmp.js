const dataTable = () => {
    let dataSet = [
        [
            "<span>1</span>", 
            "<span>42U 1200mm Deep Static Rack Server with PDU</span>", 
            "<span>2</span>", 
            "<span>Set</span>", 
            "<span>260,000</span>", 
            "<span>520,000</span>", 
            "<span>Public Bidding</span>",
            "<span class='quarterly-span'>2</span>",  // Q1
            "<span class='quarterly-span'>2</span>",  // Jan
            "<span class='quarterly-span'>0</span>",  // Feb
            "<span class='quarterly-span'>0</span>",  // Mar
            "<span class='quarterly-span'>0</span>",  // Q2
            "<span class='quarterly-span'>0</span>",  // Apr
            "<span class='quarterly-span'>0</span>",  // May
            "<span class='quarterly-span'>0</span>",  // June
            "<span class='quarterly-span'>0</span>",  // Q3
            "<span class='quarterly-span'>0</span>",  // July
            "<span class='quarterly-span'>0</span>",  // Aug
            "<span class='quarterly-span'>0</span>",  // Sept
            "<span class='quarterly-span'>0</span>",  // Q4
            "<span class='quarterly-span'>0</span>",  // Oct
            "<span class='quarterly-span'>0</span>",  // Nov
            "<span class='quarterly-span'>0</span>"   // Dec
        ]
    ];
    

    $('#cart-table').DataTable({
        destroy: true, // Ensures reinitialization doesn't cause issues
        data: dataSet, 
        columns: [
            { title: "Item No." },
            { title: "Item Description / General Specification" },
            { title: "Total Quantity" },
            { title: "Unit" },
            { title: "Unit Price" },
            { title: "Estimated Budget" },
            { title: "Mode of Procurement" },
            { title: "Q1" },
            { title: "Jan" },
            { title: "Feb" },
            { title: "Mar" },
            { title: "Q2" },
            { title: "Apr" },
            { title: "May" },
            { title: "June" },
            { title: "Q3" },
            { title: "July" },
            { title: "Aug" },
            { title: "Sept" },
            { title: "Q4" },
            { title: "Oct" },
            { title: "Nov" },
            { title: "Dec" }
        ],
        columnDefs: [
            { targets: 0, createdCell: function(td) { $(td).addClass('item-no-td'); } },
            { targets: 1, createdCell: function(td) { $(td).addClass('item-description-td'); } },
            { targets: 2, createdCell: function(td) { $(td).addClass('item-quantity-td'); } },
            { targets: 3, createdCell: function(td) { $(td).addClass('item-unit-td'); } },
            { targets: 4, createdCell: function(td) { $(td).addClass('item-price-td'); } },
            { targets: 5, createdCell: function(td) { $(td).addClass('estimated-budget-td'); } },
            { targets: 6, createdCell: function(td) { $(td).addClass('procurement-mode-td'); } },
            { targets: [7, 11, 15, 19], createdCell: function(td) { $(td).addClass('quarterly-td'); } },
            { targets: [8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22], createdCell: function(td) { $(td).addClass('monthly-td'); } },
        ],
        "paging": false,
        "info": false,
        "ordering": false,
        "stripeClasses": [],
        "search": false,
        autoWidth: false, 
    });
}

$(document).ready(function(){
    dataTable();
});
