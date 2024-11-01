const borderModel = require("../models/borderModel");

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
        res.status(200).json({
            status: "success",
            msg: "Border deleted successfully"
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