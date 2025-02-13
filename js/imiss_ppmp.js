let modal_notif = new bootstrap.Modal(document.getElementById('modal-notif'));
// modal_notif.show()

const dataTable = () => {
    try
    {
        $.ajax({
            url: '../php/fetch_approved_req.php',
            method: "GET",
            dataType: "json",
            success: function (response) {
                console.log(response);
                const filteredData = response.filteredData
                const rawData = response.rawData
                const sectionData = response.section
                try {
                    let dataSet = [];
                    let grand_total = 0;
                    for (let i = 0; i < filteredData.length; i++) {
                        grand_total += filteredData[i].itemEstimBudget
                        let formattedUnitPrice = filteredData[i].itemUnitPrice.toLocaleString()
                        let formattedEstimBudget = filteredData[i].itemEstimBudget.toLocaleString()
                        dataSet.push([
                            `<span>${filteredData[i].itemID}</span>`,
                            `<span>${filteredData[i].itemDescription}</span>`,
                            `<span >${filteredData[i].itemTotalQuantity}</span>
                            <i class="fa-solid fa-square-caret-down toggle-details" data-index="${i}" style="cursor:pointer;"></i>`,
                            `<span>${filteredData[i].itemUnit}</span>`,
                            `<span>${formattedUnitPrice}</span>`,
                            `<span>${formattedEstimBudget}</span>`,
                            `<span>${filteredData[i].itemModeOfBac}</span>`,
                            `<span class='quarterly-span'>2</span>`,  // Q1
                            `<span class='quarterly-span'>2</span>`,  // Jan
                            `<span class='quarterly-span'>0</span>`,  // Feb
                            `<span class='quarterly-span'>0</span>`,  // Mar
                            `<span class='quarterly-span'>0</span>`,  // Q2
                            `<span class='quarterly-span'>0</span>`,  // Apr
                            `<span class='quarterly-span'>0</span>`,  // May
                            `<span class='quarterly-span'>0</span>`,  // June
                            `<span class='quarterly-span'>0</span>`,  // Q3
                            `<span class='quarterly-span'>0</span>`,  // July
                            `<span class='quarterly-span'>0</span>`,  // Aug
                            `<span class='quarterly-span'>0</span>`,  // Sept
                            `<span class='quarterly-span'>0</span>`,  // Q4
                            `<span class='quarterly-span'>0</span>`,  // Oct
                            `<span class='quarterly-span'>0</span>`,  // Nov
                            `<span class='quarterly-span'>0</span>`
                        ]);
                    }
                    
                    dataSet.push([
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span">Grand Total Amount</span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span">${grand_total.toLocaleString()}</span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                        `<span class="grand-total-span"> </span>`,
                    ])

                    let table = $('#cart-table').DataTable({
                        destroy: true,
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
                        "paging": false,
                        "info": false,
                        "ordering": false,
                        "stripeClasses": [],
                        "search": false,
                        autoWidth: false,
                    });
    
                    // 🛠 Attach click event to the caret icon (Toggle breakdown details)
                    $('#cart-table tbody').on('click', '.toggle-details', function () {
                        let $icon = $(this);
                        let row = $icon.closest("tr");
                    
                        // Check if the details row exists
                        if (row.next().hasClass("details-row")) {
                            row.next().remove(); // Remove details row (closing effect)
                            
                            // Reset the caret back to default styles
                            $icon.removeClass("fa-square-caret-up").addClass("fa-square-caret-down");
                            $icon.css({
                                'color': 'black',
                                'opacity': '0.3' // Restore the default opacity
                            });
                    
                            return; // Stop execution here
                        }
                    
                        // Remove any other open detail rows before adding a new one
                        $(".details-row").remove();
                        $(".toggle-details").css({
                            'color': 'black',
                            'opacity': '0.3' // Reset all icons to default
                        });
                    
                        // Toggle icon to caret up
                        $icon.toggleClass("fa-square-caret-down fa-square-caret-up");
                        $icon.css({
                            'color': 'black',
                            'opacity': '1' // Keep this caret fully visible
                        });
                    
                        let rowIndex = $icon.data("index");
                    
                        // Construct breakdown HTML
                        let breakdownHTML = `
                            <tr class="details-row">
                                <td colspan="23">
                                    <div style="padding: 10px; background: #f9f9f9; border: 1px solid #ddd;">
                                        <strong>Item Quantity Breakdown for:</strong> ${filteredData[rowIndex].itemDescription} <br>
                                        <ul>`;
                    
                        let sectionIndex = 0; // Track section index for sectionData
                        response.rawData.forEach(item => {
                            if (item.itemID === filteredData[rowIndex].itemID) {
                                breakdownHTML += `
                                    <li><strong>Section:</strong> ${sectionData[sectionIndex]}</li>
                                    <li><strong>Item Quantity:</strong> 
                                        <input type="number" class="item-quantity-draft" value="${item.itemTotalQuantity}" /> 
                                        <button class="edit-quantity-draft">Edit</button>
                                        <button class="save-quantity-draft">Save</button>
                                    </li>
                                    <li><strong>Estimated Budget:</strong> ${item.itemEstimBudget}</li>
                                    <hr>`;
                            }
                            sectionIndex++;
                        });
                    
                        breakdownHTML += `</ul></div></td></tr>`; // Close the list and div properly
                    
                        // Insert the details row after the clicked row
                        row.after(breakdownHTML);
                    });
                    
                    
                    
                    
                } catch (innerError) {
                    console.error("Error processing response:", innerError);
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });

        
    }catch (innerError) {
        console.error("Error processing response:", innerError);
    }
}

$(document).ready(function(){
    dataTable();

    $(document).off('click', '.edit-quantity-draft').on('click', '.edit-quantity-draft', function() {      
        const index = $('.edit-quantity-draft').index(this);

        // set all back to default
        for(let i = 0; i < $('.edit-quantity-draft').length; i++){
            $('.item-quantity-draft').eq(i).css('pointer-events' , 'none')
            $('.item-quantity-draft').eq(i).css('border' , 'none')
            $('.save-quantity-draft').eq(i).css('visibility' , 'hidden')
        }


        $('.item-quantity-draft').eq(index).css('pointer-events' , 'auto')
        $('.item-quantity-draft').eq(index).css('border' , '1px solid gray')

        $('.save-quantity-draft').eq(index).css('visibility' , 'visible')

    });
});

