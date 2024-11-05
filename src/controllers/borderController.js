const borderModel = require("../models/borderModel");

const formerBorderModel = require("../models/formerBorderModel");

exports.borderCreate = async (req, res) => {
    try {
        let reqbody = req.body;
        let border = await borderModel.create(reqbody);
        res.status(201).json({
            status: "success",
            msg: "Border created successfully",
            data: border
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Failed to create border",
            error: error.message
        });
    }
};

exports.borderUpdate = async (req, res) => {
    try {
        let borderId = req.params.borderId;
        let reqbody = req.body;
        let border = await borderModel.findByIdAndUpdate(borderId, reqbody, { new: true });
        if (!border) {
            return res.status(404).json({
                status: "fail",
                msg: "Border not found"
            });
        }
        res.status(200).json({
            status: "success",
            msg: "Border updated successfully",
            data: border
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Failed to update border",
            error: error.message
        });
    }
};

exports.borderDelete = async (req, res) => {
    try {
        let borderId = req.params.borderId;
        let border = await borderModel.findByIdAndDelete(borderId);
        if (!border) {
            return res.status(404).json({
                status: "fail",
                msg: "Border not found"
            });
        }

        

        console.log(border);

        const name = border.name;
        const img = border.img;
        const email = border.email;
        const phone = border.phone;
        const address = border.address;
        const father_name = border.father_name;
        const mother_name = border.mother_name;
        const dob = border.dob;
        const father_phone_number = border.father_phone_number;
        const institute_name = border.institute_name;
        const payload = {
            name,
            img,
            email,
            phone,
            address,
            father_name,
            mother_name,
            dob,
            father_phone_number,
            institute_name
        }

        await formerBorderModel.create(payload);        

        res.status(200).json({
            status: "success",
            msg: "Border deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Failed to delete border",
            error: error.message
        });
    }
};

exports.singleBorder = async (req, res) => {
    try {
        let borderId = req.params.borderId;
        let border = await borderModel.findById(borderId);
        if (!border) {
            return res.status(404).json({
                status: "fail",
                msg: "Border not found"
            });
        }
        res.status(200).json({
            status: "success",
            msg: "Border found successfully",
            data: border
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Failed to find border",
            error: error.message
        });
    }
};

allBorderList = async (req, res) => {
    try {

        let pageNo = Number(req.params.pageNo);

        let perPage = Number(req.params.perPage);

        let searchValue = req.params.searchValue ? String(req.params.searchValue) : "";

        let skipRow = (pageNo - 1) * perPage;

        let data;
        if (searchValue !== "0" && searchValue !== "") {
            let searchRegex = { "$regex": searchValue, "$options": "i" };
            let searchQuery = { $or: [{ name: searchRegex }, { feedback: searchRegex }] };
            data = await blogModel.aggregate([
                {
                    $facet: {
                        Total: [{ $match: searchQuery }, { $count: "count" }],
                        Rows: [{ $match: searchQuery }, { $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        } else {
            data = await blogModel.aggregate([
                {
                    $facet: {
                        Total: [{ $count: "count" }],
                        Rows: [{ $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        }

        res.status(200).send({
            msg: "Blog fetched successfully",
            status: "success",
            data: data
        });
    } catch (error) {
        res.status(500).send({
            msg: "Failed to fetch blog",
            status: "fail",
            error: error.toString()
        });
    }
};
singleBlog = async (req, res) => {
    try {
        let id = req.params.id;
        let data = await blogModel.findById(id);
        if (!data) {
            return res.status(404).send({
                msg: "Blog not found",
                status: "fail",
                data: null
            });
        }
        return res.status(200).send({
            msg: "Blog fetched successfully",
            status: "success",
            data: data
        });
    } catch (error) {
        res.status(500).send({
            msg: "Failed to fetch blog",
            status: "fail",
            error: error.toString()
        });
    }
};
exports.allBorder = async (req, res) => {
    try {

        let pageNo = Number(req.params.pageNo);

        let perPage = Number(req.params.perPage);

        let searchValue = req.params.searchValue ? String(req.params.searchValue) : "";

        let skipRow = (pageNo - 1) * perPage;

        let data;

        if (searchValue !== "0" && searchValue !== "") {
            let searchRegex = { "$regex": searchValue, "$options": "i" };
            let searchQuery = { $or: [{ name: searchRegex }, { phone: searchRegex }, { email: searchRegex }] };
            data = await borderModel.aggregate([
                {
                    $facet: {
                        Total: [{ $match: searchQuery }, { $count: "count" }],
                        Rows: [{ $match: searchQuery }, { $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        } else {
            data = await borderModel.aggregate([
                {
                    $facet: {
                        Total: [{ $count: "count" }],
                        Rows: [{ $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        }

        res.status(200).send({
            msg: "Border fetched successfully",
            status: "success",
            data: data
        });
    } catch (error) {
        res.status(500).send({
            msg: "Failed to fetch border",
            status: "fail",
            error: error.toString()
        });
    }
};

exports.borderName = async (req,res)=>{
    try {
        let data = await borderModel.aggregate([
            {
                $project : {
                    name : 1
                }
            }
        ])
        res.status(200).send({
            msg: "Border name fetched successfully",
            status: "success",
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Failed to fetch border name",
            error: error.toString()
        })
    }
}